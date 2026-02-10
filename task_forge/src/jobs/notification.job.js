const notificationService = require('../api/services/notification.service');
const logger = require('../core/logger');

class NotificationJob {
  async execute(jobData) {
    try {
      logger.info('Executing notification job:', jobData);
      await notificationService.sendTaskNotification(
        jobData.taskId,
        jobData.params
      );
      return { success: true };
    } catch (error) {
      logger.error('Error executing notification job:', error);
      throw error;
    }
  }
}

module.exports = new NotificationJob();


