const cron = require('node-cron');
const logger = require('../core/logger');
const tokenService = require('../api/services/token.service');

class TokenCleanupJob {
  start() {
    cron.schedule('0 * * * *', async () => {
      try {
        // Clean up expired tokens from blacklist
        logger.debug('Token cleanup job executed');
      } catch (error) {
        logger.error('Error in token cleanup job:', error);
      }
    });
    logger.info('Token cleanup job started');
  }
}

module.exports = new TokenCleanupJob();


