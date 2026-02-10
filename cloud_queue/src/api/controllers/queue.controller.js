const queueService = require('../services/queue.service');
const responseUtil = require('../../utils/response.util');

class QueueController {
  async create(req, res, next) {
    try {
      const queueData = req.body;
      const queue = await queueService.create(queueData);
      res.status(201).json(responseUtil.success(queue, 'Queue created successfully'));
    } catch (error) {
      next(error);
    }
  }

  async get(req, res, next) {
    try {
      const { name } = req.params;
      const queue = await queueService.get(name);
      if (!queue) {
        return res.status(404).json(responseUtil.error('Queue not found', 404));
      }
      res.json(responseUtil.success(queue));
    } catch (error) {
      next(error);
    }
  }

  async list(req, res, next) {
    try {
      const { prefix, page = 1, limit = 10 } = req.query;
      const queues = await queueService.list({
        prefix,
        page: parseInt(page),
        limit: parseInt(limit)
      });
      res.json(responseUtil.success(queues));
    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      const { name } = req.params;
      const queueData = req.body;
      const queue = await queueService.update(name, queueData);
      res.json(responseUtil.success(queue, 'Queue updated successfully'));
    } catch (error) {
      next(error);
    }
  }

  async delete(req, res, next) {
    try {
      const { name } = req.params;
      await queueService.delete(name);
      res.json(responseUtil.success(null, 'Queue deleted successfully'));
    } catch (error) {
      next(error);
    }
  }

  async purge(req, res, next) {
    try {
      const { name } = req.params;
      await queueService.purge(name);
      res.json(responseUtil.success(null, 'Queue purged successfully'));
    } catch (error) {
      next(error);
    }
  }

  async pause(req, res, next) {
    try {
      const { name } = req.params;
      const queue = await queueService.pause(name);
      res.json(responseUtil.success(queue, 'Queue paused successfully'));
    } catch (error) {
      next(error);
    }
  }

  async resume(req, res, next) {
    try {
      const { name } = req.params;
      const queue = await queueService.resume(name);
      res.json(responseUtil.success(queue, 'Queue resumed successfully'));
    } catch (error) {
      next(error);
    }
  }

  async getAttributes(req, res, next) {
    try {
      const { name } = req.params;
      const attributes = await queueService.getAttributes(name);
      res.json(responseUtil.success(attributes));
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new QueueController();


