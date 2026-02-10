/**
 * Transition Validator
 * Validates state transitions
 */
const logger = require('../logger');

class TransitionValidator {
  constructor() {
    this.validationRules = new Map();
  }

  async validate(flow, fromState, toState, context = {}) {
    try {
      // Check if transition exists in flow definition
      if (!flow.transitions) {
        return { valid: false, reason: 'No transitions defined' };
      }

      const transition = flow.transitions.find(t => 
        t.from === fromState && t.to === toState
      );

      if (!transition) {
        return { 
          valid: false, 
          reason: `No transition from ${fromState} to ${toState}` 
        };
      }

      // Check conditions if any
      if (transition.condition && typeof transition.condition === 'object') {
        const conditionResult = await this.evaluateCondition(transition.condition, context);
        if (!conditionResult) {
          return { 
            valid: false, 
            reason: 'Transition condition not met' 
          };
        }
      }

      // Check guards if any
      if (transition.guards && transition.guards.length > 0) {
        for (const guard of transition.guards) {
          const guardResult = await this.evaluateGuard(guard, context);
          if (!guardResult) {
            return { 
              valid: false, 
              reason: `Guard ${guard.name || 'unnamed'} failed` 
            };
          }
        }
      }

      return { valid: true };
    } catch (error) {
      logger.error('Error validating transition:', error);
      return { valid: false, reason: error.message };
    }
  }

  async evaluateCondition(condition, context) {
    try {
      if (condition === true || condition === 'auto') {
        return true;
      }

      if (typeof condition === 'string') {
        // Simple expression evaluation
        const func = new Function('context', `return ${condition}`);
        return func(context);
      }

      if (condition.expression) {
        const func = new Function('context', `return ${condition.expression}`);
        return func(context);
      }

      return true;
    } catch (error) {
      logger.error('Error evaluating condition:', error);
      return false;
    }
  }

  async evaluateGuard(guard, context) {
    try {
      if (guard.handler && typeof guard.handler === 'function') {
        return await guard.handler(context);
      }

      if (guard.expression) {
        const func = new Function('context', `return ${guard.expression}`);
        return func(context);
      }

      return true;
    } catch (error) {
      logger.error('Error evaluating guard:', error);
      return false;
    }
  }

  registerRule(transitionKey, rule) {
    this.validationRules.set(transitionKey, rule);
  }

  unregisterRule(transitionKey) {
    this.validationRules.delete(transitionKey);
  }
}

module.exports = new TransitionValidator();
