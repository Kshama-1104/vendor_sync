const logger = require('../logger');
const stateMachine = require('./state-machine');
const EventEmitter = require('events');

/**
 * Transition Manager - Handles workflow transitions and rules
 */
class TransitionManager extends EventEmitter {
  constructor() {
    super();
    this.transitionHistory = new Map(); // workflowId -> transitions[]
    this.transitionRules = new Map(); // workflowType -> rules[]
    this.hooks = {
      before: new Map(),
      after: new Map()
    };
  }

  /**
   * Execute a transition with validation and hooks
   */
  async executeTransition(workflowType, workflowId, fromState, toState, context = {}) {
    try {
      // Validate transition is allowed
      if (!stateMachine.canTransition(workflowType, fromState, toState)) {
        throw new Error(`Transition from '${fromState}' to '${toState}' is not allowed`);
      }

      // Check transition rules
      const rulesValid = await this.validateRules(workflowType, fromState, toState, context);
      if (!rulesValid.valid) {
        throw new Error(`Transition rules validation failed: ${rulesValid.reason}`);
      }

      // Execute before hooks
      await this.executeHooks('before', workflowType, { fromState, toState, context });

      // Execute the transition
      const result = stateMachine.transition(workflowType, workflowId, fromState, toState, context);

      // Record transition history
      this.recordTransition(workflowId, {
        fromState,
        toState,
        context,
        timestamp: new Date(),
        user: context.userId || 'system'
      });

      // Execute after hooks
      await this.executeHooks('after', workflowType, { fromState, toState, context, result });

      // Emit transition event
      this.emit('transitionComplete', {
        workflowType,
        workflowId,
        fromState,
        toState,
        context
      });

      return result;
    } catch (error) {
      logger.error('Transition execution failed:', {
        workflowType,
        workflowId,
        fromState,
        toState,
        error: error.message
      });
      
      this.emit('transitionFailed', {
        workflowType,
        workflowId,
        fromState,
        toState,
        error: error.message
      });

      throw error;
    }
  }

  /**
   * Add transition rule
   */
  addRule(workflowType, rule) {
    if (!this.transitionRules.has(workflowType)) {
      this.transitionRules.set(workflowType, []);
    }
    this.transitionRules.get(workflowType).push(rule);
    logger.info(`Transition rule added for ${workflowType}:`, rule.name);
  }

  /**
   * Validate transition rules
   */
  async validateRules(workflowType, fromState, toState, context) {
    const rules = this.transitionRules.get(workflowType) || [];
    
    for (const rule of rules) {
      // Check if rule applies to this transition
      if (rule.fromState && rule.fromState !== fromState) continue;
      if (rule.toState && rule.toState !== toState) continue;

      // Execute rule validation
      if (rule.validate) {
        const result = await rule.validate(context);
        if (!result.valid) {
          return { valid: false, reason: result.reason || rule.name };
        }
      }
    }

    return { valid: true };
  }

  /**
   * Register transition hook
   */
  registerHook(timing, workflowType, hook) {
    const hookKey = `${workflowType}`;
    const hookMap = this.hooks[timing];
    
    if (!hookMap.has(hookKey)) {
      hookMap.set(hookKey, []);
    }
    hookMap.get(hookKey).push(hook);
    
    logger.info(`${timing} hook registered for ${workflowType}`);
  }

  /**
   * Execute transition hooks
   */
  async executeHooks(timing, workflowType, data) {
    const hookKey = `${workflowType}`;
    const hooks = this.hooks[timing].get(hookKey) || [];

    for (const hook of hooks) {
      try {
        await hook(data);
      } catch (error) {
        logger.error(`${timing} hook execution failed:`, error);
        if (timing === 'before') {
          throw error; // Stop transition if before hook fails
        }
      }
    }
  }

  /**
   * Record transition in history
   */
  recordTransition(workflowId, transition) {
    if (!this.transitionHistory.has(workflowId)) {
      this.transitionHistory.set(workflowId, []);
    }
    this.transitionHistory.get(workflowId).push(transition);
  }

  /**
   * Get transition history for a workflow
   */
  getHistory(workflowId) {
    return this.transitionHistory.get(workflowId) || [];
  }

  /**
   * Get latest transition for a workflow
   */
  getLatestTransition(workflowId) {
    const history = this.getHistory(workflowId);
    return history.length > 0 ? history[history.length - 1] : null;
  }

  /**
   * Calculate time in current state
   */
  getTimeInState(workflowId) {
    const latest = this.getLatestTransition(workflowId);
    if (!latest) return 0;
    return Date.now() - new Date(latest.timestamp).getTime();
  }

  /**
   * Get transition statistics
   */
  getStatistics(workflowType) {
    const allHistories = Array.from(this.transitionHistory.values()).flat();
    
    const stats = {
      totalTransitions: allHistories.length,
      transitionsByState: {},
      averageTransitionTime: 0
    };

    // Count transitions by state
    allHistories.forEach(t => {
      const key = `${t.fromState}->${t.toState}`;
      stats.transitionsByState[key] = (stats.transitionsByState[key] || 0) + 1;
    });

    return stats;
  }

  /**
   * Clear history for a workflow
   */
  clearHistory(workflowId) {
    this.transitionHistory.delete(workflowId);
  }
}

module.exports = new TransitionManager();
