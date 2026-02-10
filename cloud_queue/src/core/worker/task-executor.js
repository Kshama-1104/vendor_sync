const logger = require('../logger');

class TaskExecutor {
  constructor() {
    this.executingTasks = new Map();
  }

  async execute(task, handler) {
    try {
      const taskId = task.messageId || task.id;
      this.executingTasks.set(taskId, {
        task,
        startTime: new Date(),
        status: 'executing'
      });

      logger.debug(`Executing task: ${taskId}`);

      // Execute handler
      const result = await handler(task);

      this.executingTasks.set(taskId, {
        ...this.executingTasks.get(taskId),
        status: 'completed',
        endTime: new Date(),
        result
      });

      logger.info(`Task completed: ${taskId}`);
      return result;
    } catch (error) {
      const taskId = task.messageId || task.id;
      this.executingTasks.set(taskId, {
        ...this.executingTasks.get(taskId),
        status: 'failed',
        endTime: new Date(),
        error: error.message
      });

      logger.error(`Task failed: ${taskId}`, error);
      throw error;
    } finally {
      // Clean up after delay
      setTimeout(() => {
        const taskId = task.messageId || task.id;
        this.executingTasks.delete(taskId);
      }, 60000); // Keep for 1 minute
    }
  }

  getExecutingTask(taskId) {
    return this.executingTasks.get(taskId);
  }

  getAllExecutingTasks() {
    return Array.from(this.executingTasks.values());
  }
}

module.exports = new TaskExecutor();


