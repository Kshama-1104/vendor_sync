const logger = require('../../core/logger');
const flowEngineService = require('./flow-engine.service');

class MonitoringService {
  async getExecutionStatus(executionId) {
    try {
      // In production, this would fetch from database
      const execution = {
        id: executionId,
        status: 'running',
        currentState: 'processing',
        startedAt: new Date(),
        progress: 50
      };

      return execution;
    } catch (error) {
      logger.error(`Error getting execution status ${executionId}:`, error);
      throw error;
    }
  }

  async getMetrics(flowId, startDate, endDate) {
    try {
      const executions = await flowEngineService.getExecutions(flowId, {
        startDate,
        endDate
      });

      const metrics = {
        totalExecutions: executions.data?.length || 0,
        successful: executions.data?.filter(e => e.status === 'completed').length || 0,
        failed: executions.data?.filter(e => e.status === 'failed').length || 0,
        running: executions.data?.filter(e => e.status === 'running').length || 0,
        averageExecutionTime: 0,
        averageStateTime: 0
      };

      return metrics;
    } catch (error) {
      logger.error(`Error getting metrics for flow ${flowId}:`, error);
      throw error;
    }
  }

  async getVisualization(flowId) {
    try {
      const flow = await flowEngineService.getById(flowId);
      if (!flow) {
        throw new Error('Flow not found');
      }

      const visualization = {
        flowId: flow.id,
        flowName: flow.name,
        states: flow.states || [],
        transitions: flow.transitions || [],
        executionCount: 0,
        averageExecutionTime: 0
      };

      return visualization;
    } catch (error) {
      logger.error(`Error getting visualization for flow ${flowId}:`, error);
      throw error;
    }
  }

  async getPerformance(flowId, startDate, endDate) {
    try {
      const metrics = await this.getMetrics(flowId, startDate, endDate);

      return {
        flowId,
        period: { startDate, endDate },
        performance: {
          throughput: metrics.totalExecutions,
          successRate: metrics.totalExecutions > 0 
            ? (metrics.successful / metrics.totalExecutions) * 100 
            : 0,
          averageExecutionTime: metrics.averageExecutionTime,
          bottlenecks: []
        }
      };
    } catch (error) {
      logger.error(`Error getting performance for flow ${flowId}:`, error);
      throw error;
    }
  }
}

module.exports = new MonitoringService();


