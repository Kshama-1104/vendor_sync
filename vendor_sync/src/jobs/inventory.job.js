const inventorySyncService = require('../api/services/inventory-sync.service');
const logger = require('../core/logger');

class InventoryJob {
  async execute(jobData) {
    try {
      logger.info('Executing inventory sync job:', jobData);
      const result = await inventorySyncService.sync(
        jobData.vendorId,
        jobData.products || []
      );
      return result;
    } catch (error) {
      logger.error('Error executing inventory job:', error);
      throw error;
    }
  }
}

module.exports = new InventoryJob();


