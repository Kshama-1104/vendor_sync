const Bull = require('bull');
const redisConfig = require('../../../config/cache.config');
const logger = require('../logger');

class QueueConsumer {
  constructor() {
    this.queues = new Map();
    this.processors = new Map();
    this.initializeQueues();
  }

  initializeQueues() {
    // Sync queue
    this.syncQueue = new Bull('sync', {
      redis: redisConfig.redis
    });
    this.queues.set('sync', this.syncQueue);

    // Inventory queue
    this.inventoryQueue = new Bull('inventory', {
      redis: redisConfig.redis
    });
    this.queues.set('inventory', this.inventoryQueue);

    // Pricing queue
    this.pricingQueue = new Bull('pricing', {
      redis: redisConfig.redis
    });
    this.queues.set('pricing', this.pricingQueue);

    // Order queue
    this.orderQueue = new Bull('order', {
      redis: redisConfig.redis
    });
    this.queues.set('order', this.orderQueue);

    this.setupProcessors();
    logger.info('Queue consumer initialized');
  }

  setupProcessors() {
    // Sync processor
    this.syncQueue.process(async (job) => {
      logger.info(`Processing sync job: ${job.id}`);
      const syncEngineService = require('../../api/services/sync-engine.service');
      return await syncEngineService.executeSync(job.data);
    });

    // Inventory processor
    this.inventoryQueue.process(async (job) => {
      logger.info(`Processing inventory job: ${job.id}`);
      const inventorySyncService = require('../../api/services/inventory-sync.service');
      return await inventorySyncService.processSync(job.data);
    });

    // Pricing processor
    this.pricingQueue.process(async (job) => {
      logger.info(`Processing pricing job: ${job.id}`);
      const pricingSyncService = require('../../api/services/pricing-sync.service');
      return await pricingSyncService.processSync(job.data);
    });

    // Order processor
    this.orderQueue.process(async (job) => {
      logger.info(`Processing order job: ${job.id}`);
      const orderSyncService = require('../../api/services/order-sync.service');
      return await orderSyncService.processSync(job.data);
    });

    // Error handling
    this.queues.forEach((queue, name) => {
      queue.on('failed', (job, err) => {
        logger.error(`Job ${job.id} in ${name} queue failed:`, err);
      });

      queue.on('completed', (job) => {
        logger.info(`Job ${job.id} in ${name} queue completed`);
      });
    });
  }

  getQueue(queueName) {
    return this.queues.get(queueName);
  }

  async close() {
    for (const [name, queue] of this.queues) {
      await queue.close();
      logger.info(`Closed ${name} queue`);
    }
  }
}

module.exports = new QueueConsumer();


