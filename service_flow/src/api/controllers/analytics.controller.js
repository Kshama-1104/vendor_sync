const analyticsService = require('../services/analytics.service');
const responseUtil = require('../../utils/response.util');

class AnalyticsController {
  async getDashboard(req, res, next) {
    try {
      const { period = '7d' } = req.query;
      const dashboard = await analyticsService.getDashboard(period);
      res.json(responseUtil.success(dashboard));
    } catch (error) {
      next(error);
    }
  }

  async getServiceAnalytics(req, res, next) {
    try {
      const { startDate, endDate, serviceType } = req.query;
      const analytics = await analyticsService.getServiceAnalytics(startDate, endDate, serviceType);
      res.json(responseUtil.success(analytics));
    } catch (error) {
      next(error);
    }
  }

  async getWorkflowAnalytics(req, res, next) {
    try {
      const { startDate, endDate, workflowId } = req.query;
      const analytics = await analyticsService.getWorkflowAnalytics(startDate, endDate, workflowId);
      res.json(responseUtil.success(analytics));
    } catch (error) {
      next(error);
    }
  }

  async getDepartmentPerformance(req, res, next) {
    try {
      const { startDate, endDate } = req.query;
      const performance = await analyticsService.getDepartmentPerformance(startDate, endDate);
      res.json(responseUtil.success(performance));
    } catch (error) {
      next(error);
    }
  }

  async exportReport(req, res, next) {
    try {
      const { type, format = 'pdf', startDate, endDate } = req.query;
      const report = await analyticsService.exportReport(type, format, {
        startDate,
        endDate
      });
      res.setHeader('Content-Type', `application/${format}`);
      res.setHeader('Content-Disposition', `attachment; filename=report.${format}`);
      res.send(report);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AnalyticsController();


