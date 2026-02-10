const logger = require('../logger');

class ConditionEvaluator {
  evaluate(conditions, context) {
    if (!conditions || conditions.length === 0) {
      return true; // No conditions means always true
    }

    // All conditions must be true (AND logic)
    return conditions.every(condition => {
      try {
        return this.evaluateCondition(condition, context);
      } catch (error) {
        logger.error('Error evaluating condition:', error);
        return false;
      }
    });
  }

  evaluateCondition(condition, context) {
    const { field, operator, value } = condition;
    const fieldValue = this.getFieldValue(field, context);

    switch (operator) {
      case 'equals':
        return fieldValue === value;
      case 'not_equals':
        return fieldValue !== value;
      case 'greater_than':
        return this.compareNumbers(fieldValue, value) > 0;
      case 'less_than':
        return this.compareNumbers(fieldValue, value) < 0;
      case 'contains':
        return String(fieldValue).includes(String(value));
      case 'in':
        return Array.isArray(value) && value.includes(fieldValue);
      case 'not_in':
        return Array.isArray(value) && !value.includes(fieldValue);
      default:
        logger.warn(`Unknown operator: ${operator}`);
        return false;
    }
  }

  getFieldValue(field, context) {
    // Support nested field access (e.g., "task.priority")
    const parts = field.split('.');
    let value = context;

    for (const part of parts) {
      if (value === null || value === undefined) {
        return undefined;
      }
      value = value[part];
    }

    return value;
  }

  compareNumbers(a, b) {
    const numA = Number(a);
    const numB = Number(b);

    if (isNaN(numA) || isNaN(numB)) {
      return 0;
    }

    return numA - numB;
  }
}

module.exports = new ConditionEvaluator();


