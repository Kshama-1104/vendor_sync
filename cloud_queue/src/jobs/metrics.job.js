const cron = require('node-cron');
const logger = require('../core/logger');
const metricsService = require('../api/services/metrics.service');

class MetricsJob {
  start() {
    // Run every 5 minutes to collect metrics
    cron.schedule('*/5 * * * *', async () => {
      try {
        // In production, this would collect and store metrics
        logger.debug('Metrics job executed');
      } catch (error) {
        logger.error('Error in metrics job:', error);
      }
    });

    logger.info('Metrics job started');
  }
}

module.exports = new MetricsJob();


