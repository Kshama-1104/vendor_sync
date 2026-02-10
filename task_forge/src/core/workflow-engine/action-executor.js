const logger = require('../logger');
const taskService = require('../../api/services/task.service');
const notificationService = require('../../api/services/notification.service');

class ActionExecutor {
  async execute(actions, context) {
    const results = [];

    for (const action of actions) {
      try {
        const result = await this.executeAction(action, context);
        results.push({ action: action.type, success: true, result });
      } catch (error) {
        logger.error(`Error executing action ${action.type}:`, error);
        results.push({ action: action.type, success: false, error: error.message });
      }
    }

    return results;
  }

  async executeAction(action, context) {
    const { type, ...params } = action;

    switch (type) {
      case 'assign':
        return await this.assignTask(context.taskId, params.target);
      case 'update_status':
        return await this.updateTaskStatus(context.taskId, params.value);
      case 'set_priority':
        return await this.setTaskPriority(context.taskId, params.value);
      case 'add_tag':
        return await this.addTag(context.taskId, params.value);
      case 'set_due_date':
        return await this.setDueDate(context.taskId, params.value);
      case 'notify':
        return await this.sendNotification(context.taskId, params);
      case 'email':
        return await this.sendEmail(context.taskId, params);
      case 'escalate':
        return await this.escalate(context.taskId, params);
      case 'move_to_stage':
        return await this.moveToStage(context.taskId, params.stage);
      case 'trigger_workflow':
        return await this.triggerWorkflow(context.taskId, params.workflowId);
      default:
        throw new Error(`Unknown action type: ${type}`);
    }
  }

  async assignTask(taskId, target) {
    logger.info(`Assigning task ${taskId} to ${target}`);
    // Implementation would assign task to user/team
    return { taskId, assignedTo: target };
  }

  async updateTaskStatus(taskId, status) {
    logger.info(`Updating task ${taskId} status to ${status}`);
    await taskService.updateStatus(taskId, status);
    return { taskId, status };
  }

  async setTaskPriority(taskId, priority) {
    logger.info(`Setting task ${taskId} priority to ${priority}`);
    await taskService.update(taskId, { priority });
    return { taskId, priority };
  }

  async addTag(taskId, tag) {
    logger.info(`Adding tag ${tag} to task ${taskId}`);
    // Implementation would add tag
    return { taskId, tag };
  }

  async setDueDate(taskId, dueDate) {
    logger.info(`Setting due date for task ${taskId}`);
    await taskService.update(taskId, { dueDate });
    return { taskId, dueDate };
  }

  async sendNotification(taskId, params) {
    logger.info(`Sending notification for task ${taskId}`);
    await notificationService.sendTaskNotification(taskId, params);
    return { taskId, notificationSent: true };
  }

  async sendEmail(taskId, params) {
    logger.info(`Sending email for task ${taskId}`);
    await notificationService.sendEmail(taskId, params);
    return { taskId, emailSent: true };
  }

  async escalate(taskId, params) {
    logger.info(`Escalating task ${taskId}`);
    // Implementation would escalate to manager
    return { taskId, escalated: true };
  }

  async moveToStage(taskId, stage) {
    logger.info(`Moving task ${taskId} to stage ${stage}`);
    // Implementation would move to workflow stage
    return { taskId, stage };
  }

  async triggerWorkflow(taskId, workflowId) {
    logger.info(`Triggering workflow ${workflowId} for task ${taskId}`);
    // Implementation would trigger another workflow
    return { taskId, workflowId, triggered: true };
  }
}

module.exports = new ActionExecutor();


