const monitoringService = require('../services/monitoring.service');
const responseUtil = require('../../utils/response.util');

class MonitoringController {
  async getExecutionStatus(req, res, next) {
    try {
      const { executionId } = req.params;
      const status = await monitoringService.getExecutionStatus(executionId);
      res.json(responseUtil.success(status));
    } catch (error) {
      next(error);
    }
  }

  async getMetrics(req, res, next) {
    try {
      const { flowId, startDate, endDate } = req.query;
      const metrics = await monitoringService.getMetrics(flowId, startDate, endDate);
      res.json(responseUtil.success(metrics));
    } catch (error) {
      next(error);
    }
  }

  async getVisualization(req, res, next) {
    try {
      const { flowId } = req.params;
      const visualization = await monitoringService.getVisualization(flowId);
      res.json(responseUtil.success(visualization));
    } catch (error) {
      next(error);
    }
  }

  async getPerformance(req, res, next) {
    try {
      const { flowId, startDate, endDate } = req.query;
      const performance = await monitoringService.getPerformance(flowId, startDate, endDate);
      res.json(responseUtil.success(performance));
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new MonitoringController();


