const topicService = require('../services/topic.service');
const responseUtil = require('../../utils/response.util');

class TopicController {
  async create(req, res, next) {
    try {
      const topicData = req.body;
      const topic = await topicService.create(topicData);
      res.status(201).json(responseUtil.success(topic, 'Topic created successfully'));
    } catch (error) {
      next(error);
    }
  }

  async get(req, res, next) {
    try {
      const { name } = req.params;
      const topic = await topicService.get(name);
      if (!topic) {
        return res.status(404).json(responseUtil.error('Topic not found', 404));
      }
      res.json(responseUtil.success(topic));
    } catch (error) {
      next(error);
    }
  }

  async list(req, res, next) {
    try {
      const topics = await topicService.list();
      res.json(responseUtil.success(topics));
    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      const { name } = req.params;
      const topicData = req.body;
      const topic = await topicService.update(name, topicData);
      res.json(responseUtil.success(topic, 'Topic updated successfully'));
    } catch (error) {
      next(error);
    }
  }

  async delete(req, res, next) {
    try {
      const { name } = req.params;
      await topicService.delete(name);
      res.json(responseUtil.success(null, 'Topic deleted successfully'));
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new TopicController();


