const cron = require('node-cron');
const syncConfig = require('../../../config/sync.config');
const syncEngineService = require('../../api/services/sync-engine.service');
const logger = require('../logger');

class Scheduler {
  constructor() {
    this.jobs = new Map();
  }

  start() {
    logger.info('Starting sync scheduler...');

    // Hourly sync
    if (syncConfig.schedules.hourly.enabled) {
      this.scheduleJob('hourly', syncConfig.schedules.hourly.cron, () => {
        this.runScheduledSync('hourly');
      });
    }

    // Daily sync
    if (syncConfig.schedules.daily.enabled) {
      this.scheduleJob('daily', syncConfig.schedules.daily.cron, () => {
        this.runScheduledSync('daily');
      });
    }

    // Weekly sync
    if (syncConfig.schedules.weekly.enabled) {
      this.scheduleJob('weekly', syncConfig.schedules.weekly.cron, () => {
        this.runScheduledSync('weekly');
      });
    }

    logger.info('Sync scheduler started');
  }

  scheduleJob(name, cronExpression, callback) {
    if (cron.validate(cronExpression)) {
      const job = cron.schedule(cronExpression, callback, {
        scheduled: true,
        timezone: 'UTC'
      });
      this.jobs.set(name, job);
      logger.info(`Scheduled ${name} sync job: ${cronExpression}`);
    } else {
      logger.error(`Invalid cron expression for ${name}: ${cronExpression}`);
    }
  }

  async runScheduledSync(scheduleType) {
    try {
      logger.info(`Running ${scheduleType} scheduled sync`);
      
      // Get all active vendors
      const vendorService = require('../../api/services/vendor.service');
      const vendors = await vendorService.getActiveVendors();

      for (const vendor of vendors) {
        try {
          // Trigger sync based on vendor configuration
          await syncEngineService.triggerSync(
            vendor.id,
            'all',
            false
          );
        } catch (error) {
          logger.error(`Error syncing vendor ${vendor.id}:`, error);
        }
      }

      logger.info(`${scheduleType} scheduled sync completed`);
    } catch (error) {
      logger.error(`Error in ${scheduleType} scheduled sync:`, error);
    }
  }

  stop() {
    logger.info('Stopping sync scheduler...');
    this.jobs.forEach((job, name) => {
      job.stop();
      logger.info(`Stopped ${name} sync job`);
    });
    this.jobs.clear();
  }
}

module.exports = new Scheduler();


