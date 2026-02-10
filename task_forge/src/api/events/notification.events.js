const EventEmitter = require('events');
const logger = require('../../core/logger');
const notificationService = require('../services/notification.service');

class NotificationEvents extends EventEmitter {
  constructor() {
    super();
    this.setupListeners();
  }

  setupListeners() {
    // Task assigned
    this.on('task.assigned', async (task, assigneeId) => {
      try {
        await notificationService.sendTaskNotification(task.id, {
          type: 'task_assigned',
          assigneeId,
          template: 'task_assigned'
        });
      } catch (error) {
        logger.error('Error handling task.assigned event:', error);
      }
    });

    // Comment added
    this.on('comment.added', async (taskId, comment) => {
      try {
        await notificationService.sendTaskNotification(taskId, {
          type: 'comment_added',
          commentId: comment.id,
          template: 'comment_added'
        });
      } catch (error) {
        logger.error('Error handling comment.added event:', error);
      }
    });

    // Mention
    this.on('mention', async (taskId, mentionedUserId) => {
      try {
        await notificationService.sendTaskNotification(taskId, {
          type: 'mention',
          mentionedUserId,
          template: 'mention'
        });
      } catch (error) {
        logger.error('Error handling mention event:', error);
      }
    });
  }
}

module.exports = new NotificationEvents();


