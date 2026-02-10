const metricsService = require('../services/metrics.service');
const responseUtil = require('../../utils/response.util');

class MetricsController {
  async getAllMetrics(req, res, next) {
    try {
      const metrics = await metricsService.getAllMetrics();
      res.json(responseUtil.success(metrics));
    } catch (error) {
      next(error);
    }
  }

  async getAllTopicsMetrics(req, res, next) {
    try {
      const metrics = await metricsService.getAllTopicsMetrics();
      res.json(responseUtil.success(metrics));
    } catch (error) {
      next(error);
    }
  }

  async getTopicMetrics(req, res, next) {
    try {
      const { topicName } = req.params;
      const metrics = await metricsService.getTopicMetrics(topicName);
      res.json(responseUtil.success(metrics));
    } catch (error) {
      next(error);
    }
  }

  async getConsumerMetrics(req, res, next) {
    try {
      const { consumerGroup } = req.params;
      const metrics = await metricsService.getConsumerMetrics(consumerGroup);
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
}

module.exports = new MetricsController();


