const logger = require('../logger');

class InMemoryBroker {
  constructor() {
    this.queues = new Map();
    this.messages = new Map();
    this.stats = new Map();
  }

  async createQueue(name, config) {
    try {
      const queue = {
        name,
        config,
        messages: [],
        inFlight: new Map(),
        paused: false,
        createdAt: new Date()
      };

      this.queues.set(name, queue);
      this.stats.set(name, {
        depth: 0,
        published: 0,
        consumed: 0,
        inFlight: 0,
        averageLatency: 0,
        throughput: 0
      });

      logger.info(`Queue created in broker: ${name}`);
      return queue;
    } catch (error) {
      logger.error(`Error creating queue in broker: ${error.message}`);
      throw error;
    }
  }

  async publish(queueName, message) {
    try {
      const queue = this.queues.get(queueName);
      if (!queue) {
        throw new Error(`Queue ${queueName} not found`);
      }

      if (queue.paused) {
        throw new Error(`Queue ${queueName} is paused`);
      }

      // Add delay if specified
      if (message.delaySeconds > 0) {
        message.availableAt = new Date(Date.now() + message.delaySeconds * 1000);
      } else {
        message.availableAt = new Date();
      }

      queue.messages.push(message);
      this.updateStats(queueName, 'published');

      logger.debug(`Message published to queue ${queueName}: ${message.messageId}`);
      return message;
    } catch (error) {
      logger.error(`Error publishing message: ${error.message}`);
      throw error;
    }
  }

  async receive(queueName, options = {}) {
    try {
      const queue = this.queues.get(queueName);
      if (!queue) {
        throw new Error(`Queue ${queueName} not found`);
      }

      const {
        maxMessages = 10,
        waitTimeSeconds = 0,
        visibilityTimeout = 30
      } = options;

      const now = new Date();
      const availableMessages = queue.messages.filter(msg => 
        new Date(msg.availableAt) <= now && !queue.inFlight.has(msg.messageId)
      );

      // Sort by priority if priority queue
      if (queue.config.type === 'priority') {
        availableMessages.sort((a, b) => (b.priority || 5) - (a.priority || 5));
      }

      const messagesToReceive = availableMessages.slice(0, maxMessages);

      // Move to in-flight
      messagesToReceive.forEach(msg => {
        queue.inFlight.set(msg.messageId, {
          message: msg,
          visibilityTimeout: visibilityTimeout,
          receivedAt: now,
          visibleAt: new Date(now.getTime() + visibilityTimeout * 1000)
        });

        // Remove from available messages
        const index = queue.messages.findIndex(m => m.messageId === msg.messageId);
        if (index !== -1) {
          queue.messages.splice(index, 1);
        }
      });

      this.updateStats(queueName, 'consumed', messagesToReceive.length);
      return messagesToReceive;
    } catch (error) {
      logger.error(`Error receiving messages: ${error.message}`);
      throw error;
    }
  }

  async acknowledge(queueName, messageId) {
    try {
      const queue = this.queues.get(queueName);
      if (!queue) {
        throw new Error(`Queue ${queueName} not found`);
      }

      queue.inFlight.delete(messageId);
      this.updateStats(queueName, 'acknowledged');
      return true;
    } catch (error) {
      logger.error(`Error acknowledging message: ${error.message}`);
      throw error;
    }
  }

  async changeVisibility(queueName, messageId, visibilityTimeout) {
    try {
      const queue = this.queues.get(queueName);
      if (!queue) {
        throw new Error(`Queue ${queueName} not found`);
      }

      const inFlight = queue.inFlight.get(messageId);
      if (inFlight) {
        inFlight.visibilityTimeout = visibilityTimeout;
        inFlight.visibleAt = new Date(Date.now() + visibilityTimeout * 1000);
      }

      return true;
    } catch (error) {
      logger.error(`Error changing message visibility: ${error.message}`);
      throw error;
    }
  }

  async getQueueStats(queueName) {
    const queue = this.queues.get(queueName);
    if (!queue) {
      return null;
    }

    const stats = this.stats.get(queueName) || {};
    return {
      ...stats,
      depth: queue.messages.length,
      inFlight: queue.inFlight.size,
      paused: queue.paused
    };
  }

  async getAllQueueStats() {
    const stats = [];
    for (const [name] of this.queues) {
      stats.push(await this.getQueueStats(name));
    }
    return stats;
  }

  async purgeQueue(queueName) {
    const queue = this.queues.get(queueName);
    if (!queue) {
      throw new Error(`Queue ${queueName} not found`);
    }

    queue.messages = [];
    queue.inFlight.clear();
    this.stats.set(queueName, {
      depth: 0,
      published: 0,
      consumed: 0,
      inFlight: 0,
      averageLatency: 0,
      throughput: 0
    });

    logger.info(`Queue purged: ${queueName}`);
    return true;
  }

  async pauseQueue(queueName) {
    const queue = this.queues.get(queueName);
    if (!queue) {
      throw new Error(`Queue ${queueName} not found`);
    }

    queue.paused = true;
    logger.info(`Queue paused: ${queueName}`);
    return true;
  }

  async resumeQueue(queueName) {
    const queue = this.queues.get(queueName);
    if (!queue) {
      throw new Error(`Queue ${queueName} not found`);
    }

    queue.paused = false;
    logger.info(`Queue resumed: ${queueName}`);
    return true;
  }

  async deleteQueue(queueName) {
    this.queues.delete(queueName);
    this.stats.delete(queueName);
    logger.info(`Queue deleted from broker: ${queueName}`);
    return true;
  }

  async updateQueue(queueName, config) {
    const queue = this.queues.get(queueName);
    if (!queue) {
      throw new Error(`Queue ${queueName} not found`);
    }

    queue.config = { ...queue.config, ...config };
    return queue;
  }

  async rescheduleMessage(queueName, messageId, delay) {
    // Implementation for rescheduling messages
    return true;
  }

  async moveToDLQ(queueName, dlqName, message) {
    const dlq = this.queues.get(dlqName);
    if (!dlq) {
      await this.createQueue(dlqName, { type: 'standard' });
    }

    await this.publish(dlqName, message);
    return true;
  }

  updateStats(queueName, action, count = 1) {
    const stats = this.stats.get(queueName) || {
      depth: 0,
      published: 0,
      consumed: 0,
      inFlight: 0,
      averageLatency: 0,
      throughput: 0
    };

    switch (action) {
      case 'published':
        stats.published += count;
        break;
      case 'consumed':
        stats.consumed += count;
        break;
      case 'acknowledged':
        stats.inFlight = Math.max(0, stats.inFlight - count);
        break;
    }

    this.stats.set(queueName, stats);
  }
}

module.exports = new InMemoryBroker();


