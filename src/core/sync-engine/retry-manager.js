const syncConfig = require('../../../config/sync.config');
const logger = require('../logger');

class RetryManager {
  constructor() {
    this.retryQueue = new Map();
  }

  async retry(syncJob, error) {
    const retryCount = syncJob.retryCount || 0;
    const maxRetries = syncJob.maxRetries || syncConfig.retryAttempts;

    if (retryCount >= maxRetries) {
      logger.error(`Max retries reached for sync job ${syncJob.id}`);
      return {
        success: false,
        error: 'Max retries exceeded',
        retryCount
      };
    }

    const delay = this.calculateDelay(retryCount);
    logger.info(`Retrying sync job ${syncJob.id} in ${delay}ms (attempt ${retryCount + 1}/${maxRetries})`);

    // Schedule retry
    setTimeout(async () => {
      try {
        syncJob.retryCount = retryCount + 1;
        syncJob.lastError = error.message;
        
        // Re-execute sync
        const syncEngineService = require('../../api/services/sync-engine.service');
        await syncEngineService.executeSync(syncJob);
      } catch (retryError) {
        logger.error(`Retry failed for sync job ${syncJob.id}:`, retryError);
        // Recursively retry if not maxed out
        if (syncJob.retryCount < maxRetries) {
          await this.retry(syncJob, retryError);
        }
      }
    }, delay);

    return {
      success: true,
      retryCount: retryCount + 1,
      scheduledAt: new Date(Date.now() + delay)
    };
  }

  calculateDelay(retryCount) {
    // Exponential backoff: delay = baseDelay * 2^retryCount
    const baseDelay = syncConfig.retryDelay;
    return baseDelay * Math.pow(2, retryCount);
  }

  shouldRetry(error) {
    // Retry on transient errors
    const retryableErrors = [
      'ECONNREFUSED',
      'ETIMEDOUT',
      'ENOTFOUND',
      'ECONNRESET',
      'NetworkError',
      'TimeoutError'
    ];

    return retryableErrors.some(errorType => 
      error.code === errorType || error.name === errorType
    );
  }

  async scheduleRetry(syncJob, error) {
    if (!this.shouldRetry(error)) {
      logger.warn(`Error is not retryable for sync job ${syncJob.id}`);
      return {
        success: false,
        error: 'Error is not retryable',
        errorType: error.name || error.code
      };
    }

    return await this.retry(syncJob, error);
  }
}

module.exports = new RetryManager();


