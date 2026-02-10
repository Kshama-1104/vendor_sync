const logger = require('../../core/logger');
const flowParser = require('../../core/workflow-engine/flow-parser');
const stateMachine = require('../../core/workflow-engine/state-machine');
const transitionManager = require('../../core/workflow-engine/transition-manager');

class WorkflowEngineService {
  constructor() {
    this.workflows = [];
  }

  async getAll(activeOnly = false) {
    try {
      let workflows = [...this.workflows];
      
      if (activeOnly) {
        workflows = workflows.filter(w => w.active);
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
      // Parse and validate workflow
      const parsedWorkflow = flowParser.parse(workflowData);

      const workflow = {
        id: Date.now(),
        ...parsedWorkflow,
        version: 1,
        active: true,
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

      // Parse updated workflow
      const parsedWorkflow = flowParser.parse(workflowData);

      // Create new version
      const newVersion = {
        ...workflow,
        ...parsedWorkflow,
        version: workflow.version + 1,
        updatedAt: new Date()
      };

      // Store version history
      if (!workflow.versions) {
        workflow.versions = [];
      }
      workflow.versions.push({
        version: workflow.version,
        data: { ...workflow },
        createdAt: workflow.updatedAt
      });

      // Update workflow
      Object.assign(workflow, newVersion);

      logger.info(`Workflow updated: ${id} to version ${newVersion.version}`);
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

  async execute(workflowId, serviceId, context = {}) {
    try {
      const workflow = await this.getById(workflowId);
      if (!workflow) {
        throw new Error('Workflow not found');
      }

      // Initialize state machine
      const machine = stateMachine.create(workflow, serviceId);

      // Execute workflow
      const result = await transitionManager.execute(machine, context);

      logger.info(`Workflow ${workflowId} executed for service ${serviceId}`);
      return result;
    } catch (error) {
      logger.error(`Error executing workflow ${workflowId}:`, error);
      throw error;
    }
  }

  async getVersions(id) {
    try {
      const workflow = await this.getById(id);
      if (!workflow) {
        throw new Error('Workflow not found');
      }

      return workflow.versions || [];
    } catch (error) {
      logger.error(`Error getting workflow versions ${id}:`, error);
      throw error;
    }
  }

  async rollback(id, version) {
    try {
      const workflow = await this.getById(id);
      if (!workflow) {
        throw new Error('Workflow not found');
      }

      const targetVersion = workflow.versions?.find(v => v.version === version);
      if (!targetVersion) {
        throw new Error('Version not found');
      }

      // Restore workflow to target version
      Object.assign(workflow, targetVersion.data, {
        version: version,
        updatedAt: new Date()
      });

      logger.info(`Workflow ${id} rolled back to version ${version}`);
      return workflow;
    } catch (error) {
      logger.error(`Error rolling back workflow ${id}:`, error);
      throw error;
    }
  }
}

module.exports = new WorkflowEngineService();


