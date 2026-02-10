const cron = require('node-cron');
const logger = require('../logger');
const notificationService = require('../../api/services/notification.service');
const taskService = require('../../api/services/task.service');

class ReminderScheduler {
  constructor() {
    this.jobs = new Map();
  }

  start() {
    logger.info('Starting reminder scheduler...');

    // Check for due tasks every hour
    this.scheduleJob('check-due-tasks', '0 * * * *', () => {
      this.checkDueTasks();
    });

    // Check for overdue tasks every 6 hours
    this.scheduleJob('check-overdue-tasks', '0 */6 * * *', () => {
      this.checkOverdueTasks();
    });

    logger.info('Reminder scheduler started');
  }

  scheduleJob(name, cronExpression, callback) {
    if (cron.validate(cronExpression)) {
      const job = cron.schedule(cronExpression, callback, {
        scheduled: true,
        timezone: 'UTC'
      });
      this.jobs.set(name, job);
      logger.info(`Scheduled ${name}: ${cronExpression}`);
    } else {
      logger.error(`Invalid cron expression for ${name}: ${cronExpression}`);
    }
  }

  async checkDueTasks() {
    try {
      logger.info('Checking for tasks due soon...');
      
      // Get tasks due in next 24 hours
      const tasks = await taskService.getTasksDueSoon(24);
      
      for (const task of tasks) {
        await notificationService.sendReminder(task.id, 'due_soon');
      }

      logger.info(`Sent reminders for ${tasks.length} tasks`);
    } catch (error) {
      logger.error('Error checking due tasks:', error);
    }
  }

  async checkOverdueTasks() {
    try {
      logger.info('Checking for overdue tasks...');
      
      const tasks = await taskService.getOverdueTasks();
      
      for (const task of tasks) {
        await notificationService.sendReminder(task.id, 'overdue');
        // Escalate if needed
        if (task.daysOverdue > 3) {
          await notificationService.escalate(task.id);
        }
      }

      logger.info(`Processed ${tasks.length} overdue tasks`);
    } catch (error) {
      logger.error('Error checking overdue tasks:', error);
    }
  }

  stop() {
    logger.info('Stopping reminder scheduler...');
    this.jobs.forEach((job, name) => {
      job.stop();
      logger.info(`Stopped ${name} job`);
    });
    this.jobs.clear();
  }
}

module.exports = new ReminderScheduler();


