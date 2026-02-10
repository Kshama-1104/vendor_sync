const cron = require('node-cron');
const logger = require('../core/logger');
const inMemoryBroker = require('../core/broker/in-memory-broker');

class CleanupJob {
  start() {
    // Run every hour to clean up old messages
    cron.schedule('0 * * * *', async () => {
      try {
        // In production, this would clean up expired messages
        logger.debug('Cleanup job executed');
      } catch (error) {
        logger.error('Error in cleanup job:', error);
      }
    });

    logger.info('Cleanup job started');
  }
}

module.exports = new CleanupJob();


