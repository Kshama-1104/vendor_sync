const logger = require('../../core/logger');
const inMemoryBroker = require('../../core/broker/in-memory-broker');
const persistenceLayer = require('../../core/broker/persistence-layer');
const uuid = require('uuid');

class ProducerService {
  async publish(queueName, messageData) {
    try {
      const message = {
        messageId: uuid.v4(),
        body: messageData.body,
        attributes: messageData.attributes || {},
        priority: messageData.priority || 5,
        delaySeconds: messageData.delaySeconds || 0,
        messageGroupId: messageData.messageGroupId,
        receiptHandle: null,
        createdAt: new Date(),
        status: 'pending'
      };

      // Publish to broker
      await inMemoryBroker.publish(queueName, message);

      // Persist message
      await persistenceLayer.saveMessage(queueName, message);

      logger.info(`Message published to queue ${queueName}: ${message.messageId}`);
      return {
        messageId: message.messageId,
        queueName,
        timestamp: message.createdAt
      };
    } catch (error) {
      logger.error(`Error publishing message to queue ${queueName}:`, error);
      throw error;
    }
  }

  async publishBatch(queueName, messages) {
    try {
      const results = [];

      for (const messageData of messages) {
        try {
          const result = await this.publish(queueName, messageData);
          results.push({ success: true, ...result });
        } catch (error) {
          results.push({
            success: false,
            error: error.message
          });
        }
      }

      logger.info(`Batch published to queue ${queueName}: ${results.filter(r => r.success).length} successful`);
      return results;
    } catch (error) {
      logger.error(`Error publishing batch to queue ${queueName}:`, error);
      throw error;
    }
  }
}

module.exports = new ProducerService();


