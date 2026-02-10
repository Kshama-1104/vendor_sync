const analyticsService = require('../services/analytics.service');
const responseUtil = require('../../utils/response.util');

class AnalyticsController {
  async getDashboard(req, res, next) {
    try {
      const { vendorId, period = '7d' } = req.query;
      const dashboard = await analyticsService.getDashboard(vendorId, period);
      res.json(responseUtil.success(dashboard));
    } catch (error) {
      next(error);
    }
  }

  async getSyncMetrics(req, res, next) {
    try {
      const { vendorId, startDate, endDate } = req.query;
      const metrics = await analyticsService.getSyncMetrics(vendorId, startDate, endDate);
      res.json(responseUtil.success(metrics));
    } catch (error) {
      next(error);
    }
  }

  async getVendorPerformance(req, res, next) {
    try {
      const { vendorId } = req.params;
      const { period = '30d' } = req.query;
      const performance = await analyticsService.getVendorPerformance(vendorId, period);
      res.json(responseUtil.success(performance));
    } catch (error) {
      next(error);
    }
  }

  async getInventoryAnalytics(req, res, next) {
    try {
      const { vendorId, period } = req.query;
      const analytics = await analyticsService.getInventoryAnalytics(vendorId, period);
      res.json(responseUtil.success(analytics));
    } catch (error) {
      next(error);
    }
  }

  async getOrderAnalytics(req, res, next) {
    try {
      const { vendorId, period } = req.query;
      const analytics = await analyticsService.getOrderAnalytics(vendorId, period);
      res.json(responseUtil.success(analytics));
    } catch (error) {
      next(error);
    }
  }

  async exportReport(req, res, next) {
    try {
      const { type, format = 'pdf', vendorId, startDate, endDate } = req.query;
      const report = await analyticsService.exportReport(type, format, {
        vendorId,
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


