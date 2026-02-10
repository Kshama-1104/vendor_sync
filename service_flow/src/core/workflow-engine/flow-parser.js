const logger = require('../logger');

/**
 * Flow Parser - Parses and validates workflow definitions
 */
class FlowParser {
  /**
   * Parse workflow definition
   */
  parse(workflowData) {
    try {
      const { name, description, type, steps, triggers, conditions } = workflowData;

      // Validate required fields
      if (!name) {
        throw new Error('Workflow name is required');
      }

      // Parse and validate steps
      const parsedSteps = this.parseSteps(steps || []);

      // Parse triggers
      const parsedTriggers = this.parseTriggers(triggers || []);

      // Parse conditions
      const parsedConditions = this.parseConditions(conditions || []);

      return {
        name,
        description: description || '',
        type: type || 'sequential',
        steps: parsedSteps,
        triggers: parsedTriggers,
        conditions: parsedConditions,
        metadata: {
          parsedAt: new Date(),
          stepCount: parsedSteps.length,
          triggerCount: parsedTriggers.length
        }
      };
    } catch (error) {
      logger.error('Error parsing workflow:', error);
      throw new Error(`Workflow parsing failed: ${error.message}`);
    }
  }

  /**
   * Parse workflow steps
   */
  parseSteps(steps) {
    return steps.map((step, index) => ({
      id: step.id || `step_${index + 1}`,
      name: step.name || `Step ${index + 1}`,
      type: step.type || 'task',
      action: step.action || null,
      assignee: step.assignee || null,
      assigneeType: step.assigneeType || 'user', // user, role, group
      timeout: step.timeout || null,
      escalation: step.escalation || null,
      conditions: step.conditions || [],
      next: step.next || null,
      onApprove: step.onApprove || null,
      onReject: step.onReject || null,
      order: index + 1
    }));
  }

  /**
   * Parse workflow triggers
   */
  parseTriggers(triggers) {
    return triggers.map(trigger => ({
      type: trigger.type || 'manual',
      event: trigger.event || null,
      conditions: trigger.conditions || [],
      schedule: trigger.schedule || null
    }));
  }

  /**
   * Parse workflow conditions
   */
  parseConditions(conditions) {
    return conditions.map(condition => ({
      field: condition.field,
      operator: condition.operator || 'equals',
      value: condition.value,
      action: condition.action || 'continue'
    }));
  }

  /**
   * Validate workflow definition
   */
  validate(workflow) {
    const errors = [];

    if (!workflow.name || workflow.name.length < 3) {
      errors.push('Workflow name must be at least 3 characters');
    }

    if (!workflow.steps || workflow.steps.length === 0) {
      errors.push('Workflow must have at least one step');
    }

    // Validate each step
    workflow.steps?.forEach((step, index) => {
      if (!step.name) {
        errors.push(`Step ${index + 1} must have a name`);
      }
      if (!['task', 'approval', 'notification', 'condition', 'parallel', 'wait'].includes(step.type)) {
        errors.push(`Step ${index + 1} has invalid type: ${step.type}`);
      }
    });

    return {
      valid: errors.length === 0,
      errors
    };
  }

  /**
   * Convert workflow to execution format
   */
  toExecutionFormat(workflow) {
    return {
      id: workflow.id,
      name: workflow.name,
      version: workflow.version || 1,
      steps: workflow.steps.map(step => ({
        ...step,
        status: 'pending',
        startedAt: null,
        completedAt: null,
        result: null
      })),
      currentStep: 0,
      status: 'pending',
      startedAt: null,
      completedAt: null
    };
  }
}

module.exports = new FlowParser();
