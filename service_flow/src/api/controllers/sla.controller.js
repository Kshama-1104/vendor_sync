const slaService = require('../services/sla.service');
const responseUtil = require('../../utils/response.util');

class SLAController {
  async getStatus(req, res, next) {
    try {
      const { serviceId } = req.query;
      const status = await slaService.getStatus(serviceId);
      res.json(responseUtil.success(status));
    } catch (error) {
      next(error);
    }
  }

  async getViolations(req, res, next) {
    try {
      const { startDate, endDate, serviceType } = req.query;
      const violations = await slaService.getViolations({
        startDate,
        endDate,
        serviceType
      });
      res.json(responseUtil.success(violations));
    } catch (error) {
      next(error);
    }
  }

  async getMetrics(req, res, next) {
    try {
      const { startDate, endDate } = req.query;
      const metrics = await slaService.getMetrics(startDate, endDate);
      res.json(responseUtil.success(metrics));
    } catch (error) {
      next(error);
    }
  }

  async getByService(req, res, next) {
    try {
      const { serviceId } = req.params;
      const sla = await slaService.getByService(serviceId);
      res.json(responseUtil.success(sla));
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new SLAController();


