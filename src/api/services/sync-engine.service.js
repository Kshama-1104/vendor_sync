const logger = require('../../core/logger');
const queueProducer = require('../../core/queue/producer');
const retryManager = require('../../core/sync-engine/retry-manager');
const conflictResolver = require('../../core/sync-engine/conflict-resolver');

class SyncEngineService {
  async triggerSync(vendorId, syncType, force = false) {
    try {
      logger.info(`Triggering sync for vendor ${vendorId}, type: ${syncType}`);

      const syncJob = {
        id: `sync-${vendorId}-${syncType}-${Date.now()}`,
        vendorId,
        syncType,
        force,
        status: 'pending',
        createdAt: new Date()
      };

      // Add to queue
      await queueProducer.addSyncJob(vendorId, syncType, force ? 10 : 5);

      return syncJob;
    } catch (error) {
      logger.error('Error triggering sync:', error);
      throw error;
    }
  }

  async executeSync(syncJob) {
    try {
      logger.info(`Executing sync job: ${syncJob.id}`);

      // Update status to running
      syncJob.status = 'running';
      syncJob.startedAt = new Date();

      // Execute sync based on type
      const result = await this.performSync(syncJob);

      // Update status to completed
      syncJob.status = 'completed';
      syncJob.completedAt = new Date();
      syncJob.result = result;

      return result;
    } catch (error) {
      logger.error(`Error executing sync job ${syncJob.id}:`, error);
      syncJob.status = 'failed';
      syncJob.error = error.message;

      // Retry if applicable
      if (retryManager.shouldRetry(error)) {
        await retryManager.scheduleRetry(syncJob, error);
      }

      throw error;
    }
  }

  async performSync(syncJob) {
    const { vendorId, syncType } = syncJob;

    switch (syncType) {
      case 'inventory':
        const inventoryService = require('./inventory-sync.service');
        return await inventoryService.sync(vendorId, []);
      case 'pricing':
        const pricingService = require('./pricing-sync.service');
        return await pricingService.sync(vendorId, []);
      case 'order':
        const orderService = require('./order-sync.service');
        return await orderService.sync(vendorId, []);
      case 'all':
        // Sync all types
        return {
          inventory: await this.performSync({ ...syncJob, syncType: 'inventory' }),
          pricing: await this.performSync({ ...syncJob, syncType: 'pricing' }),
          order: await this.performSync({ ...syncJob, syncType: 'order' })
        };
      default:
        throw new Error(`Unknown sync type: ${syncType}`);
    }
  }

  async getStatus(vendorId, type) {
    // This would fetch from database
    return {
      vendorId,
      type,
      status: 'idle',
      lastSync: null,
      nextSync: null
    };
  }

  async getHistory(options = {}) {
    // This would fetch from database
    return {
      data: [],
      pagination: {
        page: options.page || 1,
        limit: options.limit || 10,
        total: 0
      }
    };
  }

  async getLogs(syncId) {
    // This would fetch from database
    return {
      syncId,
      logs: []
    };
  }

  async retrySync(syncId) {
    // This would fetch sync job and retry
    return { id: syncId, status: 'pending' };
  }

  async cancelSync(syncId) {
    // This would cancel the sync job
    return true;
  }
}

module.exports = new SyncEngineService();


