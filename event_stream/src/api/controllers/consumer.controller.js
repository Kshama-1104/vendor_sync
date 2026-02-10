const consumerService = require('../services/consumer.service');
const responseUtil = require('../../utils/response.util');

class ConsumerController {
  async create(req, res, next) {
    try {
      const consumerData = req.body;
      const consumer = await consumerService.createGroup(consumerData);
      res.status(201).json(responseUtil.success(consumer, 'Consumer group created successfully'));
    } catch (error) {
      next(error);
    }
  }

  async get(req, res, next) {
    try {
      const { name } = req.params;
      const consumer = await consumerService.getGroup(name);
      if (!consumer) {
        return res.status(404).json(responseUtil.error('Consumer group not found', 404));
      }
      res.json(responseUtil.success(consumer));
    } catch (error) {
      next(error);
    }
  }

  async list(req, res, next) {
    try {
      const consumers = await consumerService.listGroups();
      res.json(responseUtil.success(consumers));
    } catch (error) {
      next(error);
    }
  }

  async commitOffset(req, res, next) {
    try {
      const { name } = req.params;
      const { topic, partition, offset } = req.body;
      await consumerService.commitOffset(name, topic, partition, offset);
      res.json(responseUtil.success(null, 'Offset committed successfully'));
    } catch (error) {
      next(error);
    }
  }

  async getOffsets(req, res, next) {
    try {
      const { name } = req.params;
      const offsets = await consumerService.getOffsets(name);
      res.json(responseUtil.success(offsets));
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new ConsumerController();


