const serviceLifecycleService = require('../services/service-lifecycle.service');
const responseUtil = require('../../utils/response.util');

class ServiceController {
  async getAll(req, res, next) {
    try {
      const { status, priority, serviceType, page = 1, limit = 10 } = req.query;
      const result = await serviceLifecycleService.getAll({
        status,
        priority,
        serviceType,
        page: parseInt(page),
        limit: parseInt(limit),
        userId: req.user.id
      });
      res.json(responseUtil.success(result));
    } catch (error) {
      next(error);
    }
  }

  async getById(req, res, next) {
    try {
      const { id } = req.params;
      const service = await serviceLifecycleService.getById(id, req.user.id);
      if (!service) {
        return res.status(404).json(responseUtil.error('Service not found', 404));
      }
      res.json(responseUtil.success(service));
    } catch (error) {
      next(error);
    }
  }

  async create(req, res, next) {
    try {
      const serviceData = { ...req.body, requesterId: req.user.id };
      const service = await serviceLifecycleService.create(serviceData);
      res.status(201).json(responseUtil.success(service, 'Service request created successfully'));
    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      const { id } = req.params;
      const serviceData = req.body;
      const service = await serviceLifecycleService.update(id, serviceData, req.user.id);
      res.json(responseUtil.success(service, 'Service updated successfully'));
    } catch (error) {
      next(error);
    }
  }

  async updateStatus(req, res, next) {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const service = await serviceLifecycleService.updateStatus(id, status, req.user.id);
      res.json(responseUtil.success(service, 'Service status updated successfully'));
    } catch (error) {
      next(error);
    }
  }

  async cancel(req, res, next) {
    try {
      const { id } = req.params;
      const service = await serviceLifecycleService.cancel(id, req.user.id);
      res.json(responseUtil.success(service, 'Service cancelled successfully'));
    } catch (error) {
      next(error);
    }
  }

  async pause(req, res, next) {
    try {
      const { id } = req.params;
      const service = await serviceLifecycleService.pause(id, req.user.id);
      res.json(responseUtil.success(service, 'Service paused successfully'));
    } catch (error) {
      next(error);
    }
  }

  async resume(req, res, next) {
    try {
      const { id } = req.params;
      const service = await serviceLifecycleService.resume(id, req.user.id);
      res.json(responseUtil.success(service, 'Service resumed successfully'));
    } catch (error) {
      next(error);
    }
  }

  async getHistory(req, res, next) {
    try {
      const { id } = req.params;
      const history = await serviceLifecycleService.getHistory(id);
      res.json(responseUtil.success(history));
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new ServiceController();


