const logger = require('../logger');
const ruleEngineService = require('../../api/services/rule-engine.service');
const transitionEvents = require('../../api/events/transition.events');

class TransitionHandler {
  async canTransition(transition, context) {
    try {
      // Auto transition
      if (transition.condition === 'auto' || transition.condition === true) {
        return true;
      }

      // Conditional transition
      if (transition.condition && typeof transition.condition === 'object') {
        if (transition.condition.rule) {
          // Rule-based condition
          const result = await ruleEngineService.evaluate(
            context.flowId,
            transition.condition.rule,
            context
          );
          return result.result === true;
        }

        if (transition.condition.evaluate) {
          // Expression-based condition
          return this.evaluateExpression(transition.condition.evaluate, context);
        }
      }

      return false;
    } catch (error) {
      logger.error('Error checking transition:', error);
      return false;
    }
  }

  async executeTransition(transition, context) {
    try {
      transitionEvents.emit('transition.validated', {
        from: transition.from,
        to: transition.to,
        flowId: context.flowId
      });

      // Execute transition actions
      if (transition.onTransition && transition.onTransition.actions) {
        const executionService = require('../../api/services/execution.service');
        await executionService.executeActions(transition.onTransition.actions, context);
      }

      transitionEvents.emit('transition.completed', {
        from: transition.from,
        to: transition.to,
        flowId: context.flowId
      });

      return true;
    } catch (error) {
      logger.error('Error executing transition:', error);
      transitionEvents.emit('transition.failed', {
        from: transition.from,
        to: transition.to,
        flowId: context.flowId,
        error: error.message
      });
      throw error;
    }
  }

  evaluateExpression(expression, context) {
    try {
      // In production, use a safe expression evaluator
      const func = new Function('context', `return ${expression}`);
      return func(context);
    } catch (error) {
      logger.error('Error evaluating expression:', error);
      return false;
    }
  }
}

module.exports = new TransitionHandler();


