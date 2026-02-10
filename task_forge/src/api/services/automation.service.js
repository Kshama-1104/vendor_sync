const logger = require('../../core/logger');
const workflowService = require('./workflow.service');
const taskService = require('./task.service');

class AutomationService {
  async processEvent(event, context) {
    try {
      logger.info(`Processing event: ${event}`, context);

      // Get all workflows for the workspace
      const workflows = await workflowService.getAll(context.workspaceId);

      // Execute workflows that match the event
      const results = [];
      for (const workflow of workflows) {
        try {
          const result = await workflowService.execute(workflow.id, context.taskId, {
            ...context,
            event
          });
          if (result && result.length > 0) {
            results.push({ workflowId: workflow.id, result });
          }
        } catch (error) {
          logger.error(`Error executing workflow ${workflow.id}:`, error);
        }
      }

      return results;
    } catch (error) {
      logger.error('Error processing event:', error);
      throw error;
    }
  }

  async onTaskCreated(task) {
    return await this.processEvent('task.created', {
      taskId: task.id,
      workspaceId: task.workspaceId,
      task
    });
  }

  async onTaskUpdated(task, changes) {
    return await this.processEvent('task.updated', {
      taskId: task.id,
      workspaceId: task.workspaceId,
      task,
      changes
    });
  }

  async onTaskStatusChanged(task, oldStatus, newStatus) {
    return await this.processEvent('task.status.changed', {
      taskId: task.id,
      workspaceId: task.workspaceId,
      task,
      oldStatus,
      newStatus
    });
  }

  async onDueDateApproaching(task, hoursUntilDue) {
    return await this.processEvent('task.due_date.approaching', {
      taskId: task.id,
      workspaceId: task.workspaceId,
      task,
      hoursUntilDue
    });
  }

  async onTaskOverdue(task) {
    return await this.processEvent('task.overdue', {
      taskId: task.id,
      workspaceId: task.workspaceId,
      task
    });
  }
}

module.exports = new AutomationService();


