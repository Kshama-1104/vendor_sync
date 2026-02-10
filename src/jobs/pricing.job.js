const pricingSyncService = require('../api/services/pricing-sync.service');
const logger = require('../core/logger');

class PricingJob {
  async execute(jobData) {
    try {
      logger.info('Executing pricing sync job:', jobData);
      const result = await pricingSyncService.sync(
        jobData.vendorId,
        jobData.products || []
      );
      return result;
    } catch (error) {
      logger.error('Error executing pricing job:', error);
      throw error;
    }
  }
}

module.exports = new PricingJob();


