const logger = require('../logger');
const inMemoryBroker = require('../broker/in-memory-broker');

class DelayQueueScheduler {
  constructor() {
    this.intervals = new Map();
  }

  start() {
    // Check for delayed messages every second
    setInterval(() => {
      this.processDelayedMessages();
    }, 1000);

    logger.info('Delay queue scheduler started');
  }

  async processDelayedMessages() {
    try {
      // In production, this would check all queues for delayed messages
      // and make them available when their delay expires
      // For now, this is handled in the broker's receive method
    } catch (error) {
      logger.error('Error processing delayed messages:', error);
    }
  }

  scheduleMessage(queueName, message, delaySeconds) {
    try {
      message.availableAt = new Date(Date.now() + delaySeconds * 1000);
      logger.debug(`Message scheduled: ${message.messageId} available at ${message.availableAt}`);
      return message;
    } catch (error) {
      logger.error('Error scheduling message:', error);
      throw error;
    }
  }
}

module.exports = new DelayQueueScheduler();


