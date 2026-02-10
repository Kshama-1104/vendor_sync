const cron = require('node-cron');
const logger = require('../core/logger');

class SecurityMonitorJob {
  start() {
    cron.schedule('*/5 * * * *', async () => {
      try {
        // Monitor for security threats
        logger.debug('Security monitor job executed');
      } catch (error) {
        logger.error('Error in security monitor job:', error);
      }
    });
    logger.info('Security monitor job started');
  }
}

module.exports = new SecurityMonitorJob();


