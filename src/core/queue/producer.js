const logger = require('../logger');

// Mock Queue Producer (works without Redis for development)
class QueueProducer {
  constructor() {
    this.queues = new Map();
    this.jobs = new Map();
    this.initializeQueues();
  }

  initializeQueues() {
    // Initialize mock queues
    ['sync', 'inventory', 'pricing', 'order'].forEach(queueName => {
      this.queues.set(queueName, {
        name: queueName,
        jobs: []
      });
    });

    logger.info('Queue producer initialized (mock mode - no Redis required)');
  }

  async addJob(queueName, jobData, options = {}) {
    try {
      const queue = this.queues.get(queueName);
      if (!queue) {
        throw new Error(`Queue ${queueName} not found`);
      }

      const job = {
        id: options.jobId || `${queueName}-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        data: jobData,
        opts: options,
        status: 'pending',
        createdAt: new Date()
      };

      queue.jobs.push(job);
      this.jobs.set(job.id, job);

      logger.info(`Job added to ${queueName} queue: ${job.id}`);

      // Simulate async processing (mock)
      setTimeout(() => {
        job.status = 'completed';
        logger.info(`Job ${job.id} completed`);
      }, 100);

      return job;
    } catch (error) {
      logger.error(`Error adding job to ${queueName} queue:`, error);
      throw error;
    }
  }

  async addSyncJob(vendorId, syncType, priority = 5) {
    return await this.addJob('sync', {
      vendorId,
      syncType,
      timestamp: new Date()
    }, {
      priority,
      attempts: 3
    });
  }

  async addInventoryJob(vendorId, products) {
    return await this.addJob('inventory', {
      vendorId,
      products,
      timestamp: new Date()
    });
  }

  async addPricingJob(vendorId, products) {
    return await this.addJob('pricing', {
      vendorId,
      products,
      timestamp: new Date()
    });
  }

  async addOrderJob(vendorId, orders) {
    return await this.addJob('order', {
      vendorId,
      orders,
      timestamp: new Date()
    });
  }

  getQueue(queueName) {
    return this.queues.get(queueName);
  }

  getJob(jobId) {
    return this.jobs.get(jobId);
  }

  async close() {
    for (const [name, queue] of this.queues) {
      logger.info(`Closed ${name} queue`);
    }
  }
}

module.exports = new QueueProducer();


