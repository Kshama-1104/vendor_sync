const logger = require('../../core/logger');
const ruleParser = require('../../core/workflow-engine/rule-parser');
const conditionEvaluator = require('../../core/workflow-engine/condition-evaluator');
const actionExecutor = require('../../core/workflow-engine/action-executor');

class WorkflowService {
  constructor() {
    this.workflows = [];
  }

  async getAll(workspaceId) {
    try {
      let workflows = [...this.workflows];
      
      if (workspaceId) {
        workflows = workflows.filter(w => w.workspaceId === parseInt(workspaceId));
      }

      return workflows;
    } catch (error) {
      logger.error('Error getting workflows:', error);
      throw error;
    }
  }

  async getById(id) {
    try {
      const workflow = this.workflows.find(w => w.id === parseInt(id));
      return workflow || null;
    } catch (error) {
      logger.error(`Error getting workflow ${id}:`, error);
      throw error;
    }
  }

  async create(workflowData) {
    try {
      // Parse and validate rules
      const parsedRules = workflowData.rules?.map(rule => ruleParser.parse(rule)) || [];

      const workflow = {
        id: Date.now(),
        ...workflowData,
        rules: parsedRules,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      this.workflows.push(workflow);
      logger.info(`Workflow created: ${workflow.id}`);
      return workflow;
    } catch (error) {
      logger.error('Error creating workflow:', error);
      throw error;
    }
  }

  async update(id, workflowData) {
    try {
      const workflow = await this.getById(id);
      if (!workflow) {
        throw new Error('Workflow not found');
      }

      // Parse rules if provided
      if (workflowData.rules) {
        workflowData.rules = workflowData.rules.map(rule => ruleParser.parse(rule));
      }

      Object.assign(workflow, workflowData, { updatedAt: new Date() });
      logger.info(`Workflow updated: ${id}`);
      return workflow;
    } catch (error) {
      logger.error(`Error updating workflow ${id}:`, error);
      throw error;
    }
  }

  async delete(id) {
    try {
      const index = this.workflows.findIndex(w => w.id === parseInt(id));
      if (index === -1) {
        throw new Error('Workflow not found');
      }

      this.workflows.splice(index, 1);
      logger.info(`Workflow deleted: ${id}`);
      return true;
    } catch (error) {
      logger.error(`Error deleting workflow ${id}:`, error);
      throw error;
    }
  }

  async execute(workflowId, taskId, context = {}) {
    try {
      const workflow = await this.getById(workflowId);
      if (!workflow) {
        throw new Error('Workflow not found');
      }

      const results = [];

      // Evaluate each rule
      for (const rule of workflow.rules) {
        // Check trigger conditions
        if (this.shouldTrigger(rule.trigger, context)) {
          // Evaluate rule conditions
          if (conditionEvaluator.evaluate(rule.conditions, context)) {
            // Execute actions
            const actionResults = await actionExecutor.execute(rule.actions, {
              ...context,
              taskId
            });
            results.push({
              rule: rule.name,
              triggered: true,
              actions: actionResults
            });
          }
        }
      }

      logger.info(`Workflow ${workflowId} executed for task ${taskId}`);
      return results;
    } catch (error) {
      logger.error(`Error executing workflow ${workflowId}:`, error);
      throw error;
    }
  }

  shouldTrigger(trigger, context) {
    // Check if trigger event matches
    if (context.event && context.event === trigger.event) {
      // Evaluate trigger conditions if any
      if (trigger.conditions && trigger.conditions.length > 0) {
        return conditionEvaluator.evaluate(trigger.conditions, context);
      }
      return true;
    }
    return false;
  }
}

module.exports = new WorkflowService();


