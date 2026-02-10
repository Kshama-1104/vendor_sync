const cron = require('node-cron');
const logger = require('../core/logger');
const sessionService = require('../api/services/session.service');

class SessionExpiryJob {
  start() {
    cron.schedule('*/30 * * * *', async () => {
      try {
        // Clean up expired sessions
        logger.debug('Session expiry job executed');
      } catch (error) {
        logger.error('Error in session expiry job:', error);
      }
    });
    logger.info('Session expiry job started');
  }
}

module.exports = new SessionExpiryJob();


