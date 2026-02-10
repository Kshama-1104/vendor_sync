const logger = require('../../core/logger');
const executor = require('../../core/flow-engine/executor');
const contextManager = require('../../core/flow-engine/context-manager');
const flowUtil = require('../../utils/flow.util');

class FlowEngineService {
  constructor() {
    this.flows = [];
    this.executions = [];
  }

  async getAll(options = {}) {
    try {
      let flows = [...this.flows];

      if (options.status) {
        flows = flows.filter(f => f.status === options.status);
      }

      if (options.version) {
        flows = flows.filter(f => f.version === options.version);
      }

      const result = flowUtil.paginate(flows, options.page, options.limit);
      return result;
    } catch (error) {
      logger.error('Error getting flows:', error);
      throw error;
    }
  }

  async getById(id) {
    try {
      const flow = this.flows.find(f => f.id === id || f.id === parseInt(id));
      return flow || null;
    } catch (error) {
      logger.error(`Error getting flow ${id}:`, error);
      throw error;
    }
  }

  async create(flowData) {
    try {
      // Validate flow structure
      flowUtil.validateFlow(flowData);

      const flow = {
        id: Date.now(),
        ...flowData,
        status: 'active',
        version: flowData.version || '1.0.0',
        createdAt: new Date(),
        updatedAt: new Date()
      };

      this.flows.push(flow);
      logger.info(`Flow created: ${flow.id}`);
      return flow;
    } catch (error) {
      logger.error('Error creating flow:', error);
      throw error;
    }
  }

  async update(id, flowData) {
    try {
      const flow = await this.getById(id);
      if (!flow) {
        throw new Error('Flow not found');
      }

      // Validate updated flow
      flowUtil.validateFlow({ ...flow, ...flowData });

      // Create new version
      const newVersion = {
        ...flow,
        ...flowData,
        version: this.incrementVersion(flow.version),
        updatedAt: new Date()
      };

      // Store version history
      if (!flow.versions) {
        flow.versions = [];
      }
      flow.versions.push({
        version: flow.version,
        data: { ...flow },
        createdAt: flow.updatedAt
      });

      // Update flow
      Object.assign(flow, newVersion);

      logger.info(`Flow updated: ${id} to version ${newVersion.version}`);
      return flow;
    } catch (error) {
      logger.error(`Error updating flow ${id}:`, error);
      throw error;
    }
  }

  async delete(id) {
    try {
      const index = this.flows.findIndex(f => f.id === id || f.id === parseInt(id));
      if (index === -1) {
        throw new Error('Flow not found');
      }

      this.flows.splice(index, 1);
      logger.info(`Flow deleted: ${id}`);
      return true;
    } catch (error) {
      logger.error(`Error deleting flow ${id}:`, error);
      throw error;
    }
  }

  async execute(flowId, options = {}) {
    try {
      const flow = await this.getById(flowId);
      if (!flow) {
        throw new Error('Flow not found');
      }

      // Create execution context
      const context = contextManager.create(flow, options.input, options.context);

      // Execute flow
      const execution = {
        id: Date.now().toString(),
        flowId: flow.id,
        flowName: flow.name,
        status: 'running',
        context,
        startedAt: new Date(),
        currentState: flow.states.find(s => s.type === 'start')?.id
      };

      this.executions.push(execution);

      // Execute asynchronously
      executor.execute(flow, execution).catch(error => {
        logger.error(`Flow execution error: ${execution.id}`, error);
        execution.status = 'failed';
        execution.error = error.message;
        execution.completedAt = new Date();
      });

      logger.info(`Flow execution started: ${execution.id}`);
      return execution;
    } catch (error) {
      logger.error(`Error executing flow ${flowId}:`, error);
      throw error;
    }
  }

  async getExecutions(flowId, options = {}) {
    try {
      let executions = this.executions.filter(e => e.flowId === flowId || e.flowId === parseInt(flowId));

      if (options.startDate) {
        executions = executions.filter(e => new Date(e.startedAt) >= new Date(options.startDate));
      }

      if (options.endDate) {
        executions = executions.filter(e => new Date(e.startedAt) <= new Date(options.endDate));
      }

      const result = flowUtil.paginate(executions, options.page, options.limit);
      return result;
    } catch (error) {
      logger.error(`Error getting executions for flow ${flowId}:`, error);
      throw error;
    }
  }

  async getVersions(id) {
    try {
      const flow = await this.getById(id);
      if (!flow) {
        throw new Error('Flow not found');
      }

      return flow.versions || [];
    } catch (error) {
      logger.error(`Error getting flow versions ${id}:`, error);
      throw error;
    }
  }

  incrementVersion(version) {
    const parts = version.split('.');
    const minor = parseInt(parts[parts.length - 1]) + 1;
    parts[parts.length - 1] = minor.toString();
    return parts.join('.');
  }
}

module.exports = new FlowEngineService();


