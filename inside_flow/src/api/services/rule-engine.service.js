const logger = require('../../core/logger');
const rulesConfig = require('../../../config/rules.config');

class RuleEngineService {
  constructor() {
    this.rules = new Map();
    this.ruleCache = new Map();
  }

  async getRules(flowId) {
    try {
      const rules = this.rules.get(flowId) || [];
      return rules;
    } catch (error) {
      logger.error(`Error getting rules for flow ${flowId}:`, error);
      throw error;
    }
  }

  async getById(flowId, ruleId) {
    try {
      const rules = await this.getRules(flowId);
      const rule = rules.find(r => r.id === ruleId || r.id === parseInt(ruleId));
      return rule || null;
    } catch (error) {
      logger.error(`Error getting rule ${ruleId} for flow ${flowId}:`, error);
      throw error;
    }
  }

  async create(flowId, ruleData) {
    try {
      // Validate rule
      this.validateRule(ruleData);

      const rule = {
        id: ruleData.id || Date.now().toString(),
        ...ruleData,
        flowId,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const rules = this.rules.get(flowId) || [];
      rules.push(rule);
      this.rules.set(flowId, rules);

      logger.info(`Rule created: ${rule.id} for flow ${flowId}`);
      return rule;
    } catch (error) {
      logger.error(`Error creating rule for flow ${flowId}:`, error);
      throw error;
    }
  }

  async update(flowId, ruleId, ruleData) {
    try {
      const rules = await this.getRules(flowId);
      const index = rules.findIndex(r => r.id === ruleId || r.id === parseInt(ruleId));
      if (index === -1) {
        throw new Error('Rule not found');
      }

      // Validate updated rule
      this.validateRule({ ...rules[index], ...ruleData });

      const updatedRule = {
        ...rules[index],
        ...ruleData,
        updatedAt: new Date()
      };

      rules[index] = updatedRule;
      this.rules.set(flowId, rules);

      // Clear cache
      this.ruleCache.delete(`${flowId}:${ruleId}`);

      logger.info(`Rule updated: ${ruleId} for flow ${flowId}`);
      return updatedRule;
    } catch (error) {
      logger.error(`Error updating rule ${ruleId} for flow ${flowId}:`, error);
      throw error;
    }
  }

  async delete(flowId, ruleId) {
    try {
      const rules = await this.getRules(flowId);
      const filtered = rules.filter(r => r.id !== ruleId && r.id !== parseInt(ruleId));
      this.rules.set(flowId, filtered);

      // Clear cache
      this.ruleCache.delete(`${flowId}:${ruleId}`);

      logger.info(`Rule deleted: ${ruleId} for flow ${flowId}`);
      return true;
    } catch (error) {
      logger.error(`Error deleting rule ${ruleId} for flow ${flowId}:`, error);
      throw error;
    }
  }

  async evaluate(flowId, ruleId, context) {
    try {
      const cacheKey = `${flowId}:${ruleId}:${JSON.stringify(context)}`;
      
      // Check cache
      if (rulesConfig.engine.enableRuleCaching) {
        const cached = this.ruleCache.get(cacheKey);
        if (cached) {
          return cached;
        }
      }

      const rule = await this.getById(flowId, ruleId);
      if (!rule) {
        throw new Error('Rule not found');
      }

      // Evaluate rule condition
      const result = this.evaluateCondition(rule.condition, context);

      // Cache result
      if (rulesConfig.engine.enableRuleCaching) {
        this.ruleCache.set(cacheKey, result);
        setTimeout(() => {
          this.ruleCache.delete(cacheKey);
        }, rulesConfig.engine.ruleCacheTTL * 1000);
      }

      logger.debug(`Rule evaluated: ${ruleId} = ${result}`);
      return {
        ruleId,
        condition: rule.condition,
        result,
        context
      };
    } catch (error) {
      logger.error(`Error evaluating rule ${ruleId} for flow ${flowId}:`, error);
      throw error;
    }
  }

  evaluateCondition(condition, context) {
    // Simplified condition evaluation
    // In production, this would use a proper expression evaluator
    try {
      // Support simple property access
      if (typeof condition === 'string') {
        // Evaluate as JavaScript expression (in production, use safe evaluator)
        const func = new Function('context', `return ${condition}`);
        return func(context);
      }
      return false;
    } catch (error) {
      logger.error('Error evaluating condition:', error);
      return false;
    }
  }

  validateRule(rule) {
    if (!rule.name && !rule.id) {
      throw new Error('Rule must have name or id');
    }

    if (!rule.condition) {
      throw new Error('Rule must have condition');
    }
  }
}

module.exports = new RuleEngineService();


