const logger = require('../../core/logger');
const inMemoryBroker = require('../../core/broker/in-memory-broker');
const persistenceLayer = require('../../core/broker/persistence-layer');
const uuid = require('uuid');

class ConsumerService {
  async consume(queueName, options = {}) {
    try {
      const {
        maxMessages = 10,
        waitTimeSeconds = 0,
        visibilityTimeout
      } = options;

      // Receive messages from broker
      const messages = await inMemoryBroker.receive(queueName, {
        maxMessages,
        waitTimeSeconds,
        visibilityTimeout
      });

      // Generate receipt handles
      const messagesWithHandles = messages.map(msg => ({
        ...msg,
        receiptHandle: uuid.v4()
      }));

      // Update message status
      for (const message of messagesWithHandles) {
        await persistenceLayer.updateMessageStatus(queueName, message.messageId, 'in-flight', {
          receiptHandle: message.receiptHandle,
          visibilityTimeout: visibilityTimeout || 30
        });
      }

      logger.info(`Received ${messagesWithHandles.length} messages from queue ${queueName}`);
      return messagesWithHandles;
    } catch (error) {
      logger.error(`Error consuming messages from queue ${queueName}:`, error);
      throw error;
    }
  }

  async acknowledge(queueName, receiptHandle) {
    try {
      // Find message by receipt handle
      const message = await persistenceLayer.getMessageByReceiptHandle(queueName, receiptHandle);
      if (!message) {
        throw new Error('Message not found');
      }

      // Update message status
      await persistenceLayer.updateMessageStatus(queueName, message.messageId, 'processed');

      // Remove from broker
      await inMemoryBroker.acknowledge(queueName, message.messageId);

      logger.info(`Message acknowledged: ${receiptHandle}`);
      return true;
    } catch (error) {
      logger.error(`Error acknowledging message:`, error);
      throw error;
    }
  }

  async changeVisibility(queueName, receiptHandle, visibilityTimeout) {
    try {
      const message = await persistenceLayer.getMessageByReceiptHandle(queueName, receiptHandle);
      if (!message) {
        throw new Error('Message not found');
      }

      await persistenceLayer.updateMessageVisibility(queueName, message.messageId, visibilityTimeout);
      await inMemoryBroker.changeVisibility(queueName, message.messageId, visibilityTimeout);

      logger.info(`Message visibility changed: ${receiptHandle}`);
      return {
        receiptHandle,
        visibilityTimeout,
        nextVisibleAt: new Date(Date.now() + visibilityTimeout * 1000)
      };
    } catch (error) {
      logger.error(`Error changing message visibility:`, error);
      throw error;
    }
  }

  async getMessageAttributes(queueName, receiptHandle) {
    try {
      const message = await persistenceLayer.getMessageByReceiptHandle(queueName, receiptHandle);
      if (!message) {
        throw new Error('Message not found');
      }

      return {
        messageId: message.messageId,
        attributes: message.attributes,
        receiveCount: message.receiveCount || 0,
        firstReceivedAt: message.firstReceivedAt,
        createdAt: message.createdAt
      };
    } catch (error) {
      logger.error(`Error getting message attributes:`, error);
      throw error;
    }
  }
}

module.exports = new ConsumerService();


