const logger = require('../../core/logger');
const producerService = require('./producer.service');
const consumerService = require('./consumer.service');

class MessageService {
  async send(queueName, messageData) {
    try {
      logger.info(`Sending message to queue ${queueName}`);
      const result = await producerService.publish(queueName, messageData);
      return result;
    } catch (error) {
      logger.error(`Error sending message to queue ${queueName}:`, error);
      throw error;
    }
  }

  async sendBatch(queueName, messages) {
    try {
      logger.info(`Sending batch of ${messages.length} messages to queue ${queueName}`);
      const results = await producerService.publishBatch(queueName, messages);
      return {
        successful: results.filter(r => r.success).length,
        failed: results.filter(r => !r.success).length,
        results
      };
    } catch (error) {
      logger.error(`Error sending batch to queue ${queueName}:`, error);
      throw error;
    }
  }

  async receive(queueName, options = {}) {
    try {
      logger.info(`Receiving messages from queue ${queueName}`);
      const messages = await consumerService.consume(queueName, options);
      return messages;
    } catch (error) {
      logger.error(`Error receiving messages from queue ${queueName}:`, error);
      throw error;
    }
  }

  async delete(queueName, receiptHandle) {
    try {
      logger.info(`Deleting message ${receiptHandle} from queue ${queueName}`);
      await consumerService.acknowledge(queueName, receiptHandle);
      return true;
    } catch (error) {
      logger.error(`Error deleting message from queue ${queueName}:`, error);
      throw error;
    }
  }

  async changeVisibility(queueName, receiptHandle, visibilityTimeout) {
    try {
      logger.info(`Changing visibility for message ${receiptHandle} in queue ${queueName}`);
      const result = await consumerService.changeVisibility(queueName, receiptHandle, visibilityTimeout);
      return result;
    } catch (error) {
      logger.error(`Error changing message visibility in queue ${queueName}:`, error);
      throw error;
    }
  }

  async getAttributes(queueName, receiptHandle) {
    try {
      const attributes = await consumerService.getMessageAttributes(queueName, receiptHandle);
      return attributes;
    } catch (error) {
      logger.error(`Error getting message attributes:`, error);
      throw error;
    }
  }
}

module.exports = new MessageService();


