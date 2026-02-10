const cron = require('node-cron');
const logger = require('../logger');
const notificationService = require('../../api/services/notification.service');
const taskService = require('../../api/services/task.service');
const workflowConfig = require('../../../config/workflow.config');

class EscalationScheduler {
  constructor() {
    this.jobs = new Map();
  }

  start() {
    if (!workflowConfig.sla.enabled) {
      logger.info('SLA escalation is disabled');
      return;
    }

    logger.info('Starting escalation scheduler...');

    // Check SLA violations every hour
    this.scheduleJob('check-sla', '0 * * * *', () => {
      this.checkSLAViolations();
    });

    logger.info('Escalation scheduler started');
  }

  scheduleJob(name, cronExpression, callback) {
    if (cron.validate(cronExpression)) {
      const job = cron.schedule(cronExpression, callback, {
        scheduled: true,
        timezone: 'UTC'
      });
      this.jobs.set(name, job);
      logger.info(`Scheduled ${name}: ${cronExpression}`);
    }
  }

  async checkSLAViolations() {
    try {
      logger.info('Checking for SLA violations...');

      const responseTime = workflowConfig.sla.defaultResponseTime;
      const resolutionTime = workflowConfig.sla.defaultResolutionTime;

      // Check response time violations
      const responseViolations = await taskService.getSLAViolations('response', responseTime);
      for (const task of responseViolations) {
        await notificationService.sendSLAAlert(task.id, 'response_time');
        if (workflowConfig.sla.escalationEnabled) {
          await notificationService.escalate(task.id);
        }
      }

      // Check resolution time violations
      const resolutionViolations = await taskService.getSLAViolations('resolution', resolutionTime);
      for (const task of resolutionViolations) {
        await notificationService.sendSLAAlert(task.id, 'resolution_time');
        if (workflowConfig.sla.escalationEnabled) {
          await notificationService.escalate(task.id);
        }
      }

      logger.info(`Processed ${responseViolations.length + resolutionViolations.length} SLA violations`);
    } catch (error) {
      logger.error('Error checking SLA violations:', error);
    }
  }

  stop() {
    logger.info('Stopping escalation scheduler...');
    this.jobs.forEach((job, name) => {
      job.stop();
      logger.info(`Stopped ${name} job`);
    });
    this.jobs.clear();
  }
}

module.exports = new EscalationScheduler();


