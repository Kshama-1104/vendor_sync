const cron = require('node-cron');
const logger = require('../core/logger');
const retryService = require('../api/services/retry.service');

class RetryJob {
  start() {
    // Run every minute to check for messages that need retry
    cron.schedule('* * * * *', async () => {
      try {
        // In production, this would check for messages that need retrying
        logger.debug('Retry job executed');
      } catch (error) {
        logger.error('Error in retry job:', error);
      }
    });

    logger.info('Retry job started');
  }
}

module.exports = new RetryJob();


