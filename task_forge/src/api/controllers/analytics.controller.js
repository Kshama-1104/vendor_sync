const analyticsService = require('../services/analytics.service');
const responseUtil = require('../../utils/response.util');

class AnalyticsController {
  async getDashboard(req, res, next) {
    try {
      const { workspaceId, period = '7d' } = req.query;
      const dashboard = await analyticsService.getDashboard(workspaceId, period);
      res.json(responseUtil.success(dashboard));
    } catch (error) {
      next(error);
    }
  }

  async getTaskAnalytics(req, res, next) {
    try {
      const { workspaceId, startDate, endDate } = req.query;
      const analytics = await analyticsService.getTaskAnalytics(workspaceId, startDate, endDate);
      res.json(responseUtil.success(analytics));
    } catch (error) {
      next(error);
    }
  }

  async getUserPerformance(req, res, next) {
    try {
      const { userId } = req.params;
      const { period = '30d' } = req.query;
      const performance = await analyticsService.getUserPerformance(userId, period);
      res.json(responseUtil.success(performance));
    } catch (error) {
      next(error);
    }
  }

  async getWorkspaceAnalytics(req, res, next) {
    try {
      const { workspaceId } = req.params;
      const { period = '30d' } = req.query;
      const analytics = await analyticsService.getWorkspaceAnalytics(workspaceId, period);
      res.json(responseUtil.success(analytics));
    } catch (error) {
      next(error);
    }
  }

  async exportReport(req, res, next) {
    try {
      const { type, format = 'pdf', workspaceId, startDate, endDate } = req.query;
      const report = await analyticsService.exportReport(type, format, {
        workspaceId,
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


