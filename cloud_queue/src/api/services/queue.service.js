const logger = require('../../core/logger');
const inMemoryBroker = require('../../core/broker/in-memory-broker');
const persistenceLayer = require('../../core/broker/persistence-layer');

class QueueService {
  constructor() {
    this.queues = [];
  }

  async create(queueData) {
    try {
      const queue = {
        id: Date.now(),
        name: queueData.name,
        type: queueData.type || 'standard',
        fifo: queueData.fifo || false,
        maxMessageSize: queueData.maxMessageSize || 262144,
        messageRetentionPeriod: queueData.messageRetentionPeriod || 345600,
        visibilityTimeout: queueData.visibilityTimeout || 30,
        receiveMessageWaitTime: queueData.receiveMessageWaitTime || 0,
        maxReceiveCount: queueData.maxReceiveCount || 3,
        dlqName: queueData.dlqName,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      this.queues.push(queue);

      // Create queue in broker
      await inMemoryBroker.createQueue(queue.name, queue);

      // Persist to database
      await persistenceLayer.saveQueue(queue);

      logger.info(`Queue created: ${queue.name}`);
      return queue;
    } catch (error) {
      logger.error('Error creating queue:', error);
      throw error;
    }
  }

  async get(name) {
    try {
      const queue = this.queues.find(q => q.name === name);
      if (!queue) {
        return null;
      }

      // Get queue stats from broker
      const stats = await inMemoryBroker.getQueueStats(name);
      return {
        ...queue,
        ...stats
      };
    } catch (error) {
      logger.error(`Error getting queue ${name}:`, error);
      throw error;
    }
  }

  async list(options = {}) {
    try {
      let queues = [...this.queues];

      // Filter by prefix
      if (options.prefix) {
        queues = queues.filter(q => q.name.startsWith(options.prefix));
      }

      // Paginate
      const offset = (options.page - 1) * options.limit;
      const paginated = queues.slice(offset, offset + options.limit);

      return {
        data: paginated,
        pagination: {
          page: options.page,
          limit: options.limit,
          total: queues.length,
          totalPages: Math.ceil(queues.length / options.limit)
        }
      };
    } catch (error) {
      logger.error('Error listing queues:', error);
      throw error;
    }
  }

  async update(name, queueData) {
    try {
      const queue = this.queues.find(q => q.name === name);
      if (!queue) {
        throw new Error('Queue not found');
      }

      Object.assign(queue, queueData, { updatedAt: new Date() });

      // Update in broker
      await inMemoryBroker.updateQueue(name, queue);

      // Persist to database
      await persistenceLayer.updateQueue(name, queue);

      logger.info(`Queue updated: ${name}`);
      return queue;
    } catch (error) {
      logger.error(`Error updating queue ${name}:`, error);
      throw error;
    }
  }

  async delete(name) {
    try {
      const index = this.queues.findIndex(q => q.name === name);
      if (index === -1) {
        throw new Error('Queue not found');
      }

      this.queues.splice(index, 1);

      // Delete from broker
      await inMemoryBroker.deleteQueue(name);

      // Delete from database
      await persistenceLayer.deleteQueue(name);

      logger.info(`Queue deleted: ${name}`);
      return true;
    } catch (error) {
      logger.error(`Error deleting queue ${name}:`, error);
      throw error;
    }
  }

  async purge(name) {
    try {
      await inMemoryBroker.purgeQueue(name);
      logger.info(`Queue purged: ${name}`);
      return true;
    } catch (error) {
      logger.error(`Error purging queue ${name}:`, error);
      throw error;
    }
  }

  async pause(name) {
    try {
      const queue = await this.get(name);
      if (!queue) {
        throw new Error('Queue not found');
      }

      queue.status = 'paused';
      await inMemoryBroker.pauseQueue(name);
      logger.info(`Queue paused: ${name}`);
      return queue;
    } catch (error) {
      logger.error(`Error pausing queue ${name}:`, error);
      throw error;
    }
  }

  async resume(name) {
    try {
      const queue = await this.get(name);
      if (!queue) {
        throw new Error('Queue not found');
      }

      queue.status = 'active';
      await inMemoryBroker.resumeQueue(name);
      logger.info(`Queue resumed: ${name}`);
      return queue;
    } catch (error) {
      logger.error(`Error resuming queue ${name}:`, error);
      throw error;
    }
  }

  async getAttributes(name) {
    try {
      const queue = await this.get(name);
      if (!queue) {
        throw new Error('Queue not found');
      }

      return {
        name: queue.name,
        type: queue.type,
        fifo: queue.fifo,
        maxMessageSize: queue.maxMessageSize,
        messageRetentionPeriod: queue.messageRetentionPeriod,
        visibilityTimeout: queue.visibilityTimeout,
        receiveMessageWaitTime: queue.receiveMessageWaitTime,
        maxReceiveCount: queue.maxReceiveCount,
        dlqName: queue.dlqName,
        createdAt: queue.createdAt,
        updatedAt: queue.updatedAt
      };
    } catch (error) {
      logger.error(`Error getting queue attributes ${name}:`, error);
      throw error;
    }
  }
}

module.exports = new QueueService();


