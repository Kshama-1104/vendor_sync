const orderSyncService = require('../api/services/order-sync.service');
const logger = require('../core/logger');

class OrderJob {
  async execute(jobData) {
    try {
      logger.info('Executing order sync job:', jobData);
      const result = await orderSyncService.sync(
        jobData.vendorId,
        jobData.orders || []
      );
      return result;
    } catch (error) {
      logger.error('Error executing order job:', error);
      throw error;
    }
  }
}

module.exports = new OrderJob();


