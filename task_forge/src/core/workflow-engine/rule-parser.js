const logger = require('../logger');
const workflowConfig = require('../../../config/workflow.config');

class RuleParser {
  parse(ruleDefinition) {
    try {
      const rule = {
        name: ruleDefinition.name,
        trigger: this.parseTrigger(ruleDefinition.trigger),
        conditions: this.parseConditions(ruleDefinition.conditions || []),
        actions: this.parseActions(ruleDefinition.actions || [])
      };

      this.validateRule(rule);
      return rule;
    } catch (error) {
      logger.error('Error parsing rule:', error);
      throw new Error(`Invalid rule definition: ${error.message}`);
    }
  }

  parseTrigger(trigger) {
    if (!trigger || !trigger.event) {
      throw new Error('Trigger must have an event');
    }

    if (!workflowConfig.triggers.events.includes(trigger.event)) {
      throw new Error(`Invalid trigger event: ${trigger.event}`);
    }

    return {
      event: trigger.event,
      conditions: trigger.conditions || []
    };
  }

  parseConditions(conditions) {
    return conditions.map(condition => {
      if (!condition.field || !condition.operator || condition.value === undefined) {
        throw new Error('Condition must have field, operator, and value');
      }

      if (!workflowConfig.conditions.operators.includes(condition.operator)) {
        throw new Error(`Invalid condition operator: ${condition.operator}`);
      }

      return {
        field: condition.field,
        operator: condition.operator,
        value: condition.value
      };
    });
  }

  parseActions(actions) {
    if (actions.length > workflowConfig.engine.maxActionsPerRule) {
      throw new Error(`Maximum ${workflowConfig.engine.maxActionsPerRule} actions per rule`);
    }

    return actions.map(action => {
      if (!action.type) {
        throw new Error('Action must have a type');
      }

      const validTypes = [
        ...workflowConfig.actions.task,
        ...workflowConfig.actions.notification,
        ...workflowConfig.actions.workflow
      ];

      if (!validTypes.includes(action.type)) {
        throw new Error(`Invalid action type: ${action.type}`);
      }

      return {
        type: action.type,
        ...action
      };
    });
  }

  validateRule(rule) {
    if (!rule.name) {
      throw new Error('Rule must have a name');
    }

    if (!rule.trigger) {
      throw new Error('Rule must have a trigger');
    }

    if (!rule.actions || rule.actions.length === 0) {
      throw new Error('Rule must have at least one action');
    }
  }
}

module.exports = new RuleParser();


