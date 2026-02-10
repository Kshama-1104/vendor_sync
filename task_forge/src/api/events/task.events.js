const EventEmitter = require('events');
const logger = require('../../core/logger');
const automationService = require('../services/automation.service');

class TaskEvents extends EventEmitter {
  constructor() {
    super();
    this.setupListeners();
  }

  setupListeners() {
    // Task created
    this.on('task.created', async (task) => {
      try {
        await automationService.onTaskCreated(task);
      } catch (error) {
        logger.error('Error handling task.created event:', error);
      }
    });

    // Task updated
    this.on('task.updated', async (task, changes) => {
      try {
        await automationService.onTaskUpdated(task, changes);
      } catch (error) {
        logger.error('Error handling task.updated event:', error);
      }
    });

    // Task status changed
    this.on('task.status.changed', async (task, oldStatus, newStatus) => {
      try {
        await automationService.onTaskStatusChanged(task, oldStatus, newStatus);
      } catch (error) {
        logger.error('Error handling task.status.changed event:', error);
      }
    });

    // Due date approaching
    this.on('task.due_date.approaching', async (task, hoursUntilDue) => {
      try {
        await automationService.onDueDateApproaching(task, hoursUntilDue);
      } catch (error) {
        logger.error('Error handling task.due_date.approaching event:', error);
      }
    });

    // Task overdue
    this.on('task.overdue', async (task) => {
      try {
        await automationService.onTaskOverdue(task);
      } catch (error) {
        logger.error('Error handling task.overdue event:', error);
      }
    });
  }
}

module.exports = new TaskEvents();


