const logger = require('../../core/logger');
const retryConfig = require('../../../config/retry.config');
const inMemoryBroker = require('../../core/broker/in-memory-broker');
const persistenceLayer = require('../../core/broker/persistence-layer');

class RetryService {
  async retry(queueName, messageId, error) {
    try {
      const message = await persistenceLayer.getMessage(queueName, messageId);
      if (!message) {
        throw new Error('Message not found');
      }

      const receiveCount = (message.receiveCount || 0) + 1;

      if (receiveCount >= retryConfig.maxRetries) {
        // Move to DLQ
        await this.moveToDLQ(queueName, message, error);
        return { movedToDLQ: true };
      }

      // Calculate retry delay
      const delay = this.calculateRetryDelay(receiveCount);

      // Update message
      await persistenceLayer.updateMessage(queueName, messageId, {
        receiveCount,
        lastError: error.message,
        retryAt: new Date(Date.now() + delay)
      });

      // Reschedule message
      await inMemoryBroker.rescheduleMessage(queueName, messageId, delay);

      logger.info(`Message ${messageId} scheduled for retry ${receiveCount}/${retryConfig.maxRetries} in ${delay}ms`);
      return {
        retryCount: receiveCount,
        nextRetryAt: new Date(Date.now() + delay)
      };
    } catch (error) {
      logger.error(`Error retrying message ${messageId}:`, error);
      throw error;
    }
  }

  calculateRetryDelay(retryCount) {
    const strategy = retryConfig.strategy;

    switch (strategy) {
      case 'exponential':
        const delay = Math.min(
          retryConfig.exponential.initialDelay * Math.pow(retryConfig.exponential.multiplier, retryCount - 1),
          retryConfig.exponential.maxDelay
        );
        return retryConfig.jitter ? this.addJitter(delay) : delay;

      case 'linear':
        const linearDelay = Math.min(
          retryConfig.linear.initialDelay + (retryConfig.linear.increment * (retryCount - 1)),
          retryConfig.linear.maxDelay
        );
        return retryConfig.jitter ? this.addJitter(linearDelay) : linearDelay;

      case 'fixed':
        return retryConfig.fixed.delay;

      default:
        return retryConfig.initialDelay;
    }
  }

  addJitter(delay) {
    const jitter = delay * 0.1; // 10% jitter
    return delay + (Math.random() * jitter * 2 - jitter);
  }

  async moveToDLQ(queueName, message, error) {
    try {
      const dlqName = `${queueName}-dlq`;

      // Create DLQ if it doesn't exist
      const queueService = require('./queue.service');
      const dlq = await queueService.get(dlqName);
      if (!dlq && retryConfig.dlq.autoCreate) {
        await queueService.create({
          name: dlqName,
          type: 'standard',
          messageRetentionPeriod: retryConfig.dlq.defaultRetentionPeriod
        });
      }

      // Move message to DLQ
      await inMemoryBroker.moveToDLQ(queueName, dlqName, message);
      await persistenceLayer.moveToDLQ(queueName, dlqName, message, error);

      logger.warn(`Message ${message.messageId} moved to DLQ: ${dlqName}`);
      return { dlqName };
    } catch (error) {
      logger.error(`Error moving message to DLQ:`, error);
      throw error;
    }
  }
}

module.exports = new RetryService();


