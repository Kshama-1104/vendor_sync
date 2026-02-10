const cron = require('node-cron');
const logger = require('../logger');
const producerService = require('../../api/services/producer.service');

class CronQueueScheduler {
  constructor() {
    this.jobs = new Map();
  }

  schedule(queueName, cronExpression, messageTemplate) {
    try {
      const job = cron.schedule(cronExpression, async () => {
        try {
          logger.info(`Cron job triggered for queue ${queueName}`);
          await producerService.publish(queueName, messageTemplate);
        } catch (error) {
          logger.error(`Error executing cron job for queue ${queueName}:`, error);
        }
      });

      const jobId = `${queueName}-${Date.now()}`;
      this.jobs.set(jobId, {
        id: jobId,
        queueName,
        cronExpression,
        messageTemplate,
        job,
        createdAt: new Date()
      });

      logger.info(`Cron job scheduled: ${jobId} for queue ${queueName}`);
      return jobId;
    } catch (error) {
      logger.error('Error scheduling cron job:', error);
      throw error;
    }
  }

  unschedule(jobId) {
    try {
      const jobData = this.jobs.get(jobId);
      if (jobData) {
        jobData.job.stop();
        this.jobs.delete(jobId);
        logger.info(`Cron job unscheduled: ${jobId}`);
        return true;
      }
      return false;
    } catch (error) {
      logger.error(`Error unscheduling cron job ${jobId}:`, error);
      throw error;
    }
  }

  list() {
    return Array.from(this.jobs.values());
  }
}

module.exports = new CronQueueScheduler();


