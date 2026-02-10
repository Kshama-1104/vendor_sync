require('dotenv').config();

module.exports = {
  engine: {
    enabled: true,
    maxRulesPerFlow: parseInt(process.env.MAX_RULES_PER_FLOW) || 100,
    enableRuleCaching: process.env.ENABLE_RULE_CACHING === 'true',
    ruleCacheTTL: parseInt(process.env.RULE_CACHE_TTL) || 3600
  },
  evaluation: {
    timeout: parseInt(process.env.RULE_EVALUATION_TIMEOUT) || 5000, // 5 seconds
    maxComplexity: parseInt(process.env.MAX_RULE_COMPLEXITY) || 100,
    enableAsyncEvaluation: process.env.ENABLE_ASYNC_RULE_EVALUATION === 'true'
  },
  conditions: {
    supportedOperators: [
      'equals',
      'notEquals',
      'greaterThan',
      'lessThan',
      'greaterThanOrEqual',
      'lessThanOrEqual',
      'contains',
      'notContains',
      'in',
      'notIn',
      'exists',
      'notExists'
    ],
    enableComplexConditions: true,
    enableNestedConditions: true
  },
  actions: {
    supportedActions: [
      'transition',
      'setContext',
      'callService',
      'sendEvent',
      'log'
    ],
    enableAsyncActions: true,
    maxActionTimeout: parseInt(process.env.MAX_ACTION_TIMEOUT) || 300000 // 5 minutes
  }
};


