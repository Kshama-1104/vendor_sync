const workerService = require('../services/worker.service');
const responseUtil = require('../../utils/response.util');

class WorkerController {
  async register(req, res, next) {
    try {
      const workerData = req.body;
      const worker = await workerService.register(workerData);
      res.status(201).json(responseUtil.success(worker, 'Worker registered successfully'));
    } catch (error) {
      next(error);
    }
  }

  async getStatus(req, res, next) {
    try {
      const { id } = req.params;
      const status = await workerService.getStatus(id);
      if (!status) {
        return res.status(404).json(responseUtil.error('Worker not found', 404));
      }
      res.json(responseUtil.success(status));
    } catch (error) {
      next(error);
    }
  }

  async list(req, res, next) {
    try {
      const { queueName, status } = req.query;
      const workers = await workerService.list({ queueName, status });
      res.json(responseUtil.success(workers));
    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      const { id } = req.params;
      const workerData = req.body;
      const worker = await workerService.update(id, workerData);
      res.json(responseUtil.success(worker, 'Worker updated successfully'));
    } catch (error) {
      next(error);
    }
  }

  async deregister(req, res, next) {
    try {
      const { id } = req.params;
      await workerService.deregister(id);
      res.json(responseUtil.success(null, 'Worker deregistered successfully'));
    } catch (error) {
      next(error);
    }
  }

  async scale(req, res, next) {
    try {
      const { queueName, targetCount } = req.body;
      const result = await workerService.scale(queueName, targetCount);
      res.json(responseUtil.success(result, 'Workers scaled successfully'));
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new WorkerController();


