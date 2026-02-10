const metricsService = require('../services/metrics.service');
const responseUtil = require('../../utils/response.util');

class MetricsController {
  async getQueueMetrics(req, res, next) {
    try {
      const { queueName } = req.params;
      const { startDate, endDate } = req.query;
      const metrics = await metricsService.getQueueMetrics(queueName, startDate, endDate);
      res.json(responseUtil.success(metrics));
    } catch (error) {
      next(error);
    }
  }

  async getWorkerMetrics(req, res, next) {
    try {
      const metrics = await metricsService.getWorkerMetrics();
      res.json(responseUtil.success(metrics));
    } catch (error) {
      next(error);
    }
  }

  async getSystemMetrics(req, res, next) {
    try {
      const metrics = await metricsService.getSystemMetrics();
      res.json(responseUtil.success(metrics));
    } catch (error) {
      next(error);
    }
  }

  async getConsumerLag(req, res, next) {
    try {
      const { queueName } = req.params;
      const lag = await metricsService.getConsumerLag(queueName);
      res.json(responseUtil.success(lag));
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new MetricsController();


