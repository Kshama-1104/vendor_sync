const logger = require('../../core/logger');
const executor = require('../../core/flow-engine/executor');
const executionConfig = require('../../../config/execution.config');

class ExecutionService {
  async executeAction(action, context) {
    try {
      logger.debug(`Executing action: ${action.type}`);

      const startTime = Date.now();

      // Execute action based on type
      let result;
      switch (action.type) {
        case 'validate':
          result = await this.executeValidate(action, context);
          break;
        case 'process':
          result = await this.executeProcess(action, context);
          break;
        case 'callService':
          result = await this.executeCallService(action, context);
          break;
        case 'setContext':
          result = await this.executeSetContext(action, context);
          break;
        case 'sendEvent':
          result = await this.executeSendEvent(action, context);
          break;
        default:
          throw new Error(`Unknown action type: ${action.type}`);
      }

      const duration = Date.now() - startTime;
      logger.info(`Action executed: ${action.type} in ${duration}ms`);

      return {
        success: true,
        result,
        duration
      };
    } catch (error) {
      logger.error(`Error executing action ${action.type}:`, error);
      throw error;
    }
  }

  async executeValidate(action, context) {
    // Validation logic
    return { valid: true };
  }

  async executeProcess(action, context) {
    // Processing logic
    return { processed: true };
  }

  async executeCallService(action, context) {
    // Service call logic
    return { called: true };
  }

  async executeSetContext(action, context) {
    // Context update logic
    Object.assign(context, action.data || {});
    return { updated: true };
  }

  async executeSendEvent(action, context) {
    // Event sending logic
    const internalEvents = require('../events/internal.events');
    internalEvents.emit(action.event, context);
    return { sent: true };
  }

  async executeActions(actions, context, parallel = false) {
    try {
      if (parallel && executionConfig.mode.parallel.enabled) {
        // Execute actions in parallel
        const promises = actions.map(action => this.executeAction(action, context));
        const results = await Promise.allSettled(promises);
        return results.map((r, i) => ({
          action: actions[i],
          ...(r.status === 'fulfilled' ? r.value : { success: false, error: r.reason.message })
        }));
      } else {
        // Execute actions sequentially
        const results = [];
        for (const action of actions) {
          const result = await this.executeAction(action, context);
          results.push({ action, ...result });
        }
        return results;
      }
    } catch (error) {
      logger.error('Error executing actions:', error);
      throw error;
    }
  }
}

module.exports = new ExecutionService();


