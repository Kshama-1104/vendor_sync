const messageService = require('../services/message.service');
const responseUtil = require('../../utils/response.util');

class MessageController {
  async send(req, res, next) {
    try {
      const { queueName } = req.params;
      const messageData = req.body;
      const result = await messageService.send(queueName, messageData);
      res.status(201).json(responseUtil.success(result, 'Message sent successfully'));
    } catch (error) {
      next(error);
    }
  }

  async sendBatch(req, res, next) {
    try {
      const { queueName } = req.params;
      const { messages } = req.body;
      const result = await messageService.sendBatch(queueName, messages);
      res.status(201).json(responseUtil.success(result, 'Messages sent successfully'));
    } catch (error) {
      next(error);
    }
  }

  async receive(req, res, next) {
    try {
      const { queueName } = req.params;
      const { maxMessages = 10, waitTimeSeconds = 0, visibilityTimeout } = req.query;
      const messages = await messageService.receive(queueName, {
        maxMessages: parseInt(maxMessages),
        waitTimeSeconds: parseInt(waitTimeSeconds),
        visibilityTimeout: visibilityTimeout ? parseInt(visibilityTimeout) : undefined
      });
      res.json(responseUtil.success(messages));
    } catch (error) {
      next(error);
    }
  }

  async delete(req, res, next) {
    try {
      const { queueName, receiptHandle } = req.params;
      await messageService.delete(queueName, receiptHandle);
      res.json(responseUtil.success(null, 'Message deleted successfully'));
    } catch (error) {
      next(error);
    }
  }

  async changeVisibility(req, res, next) {
    try {
      const { queueName, receiptHandle } = req.params;
      const { visibilityTimeout } = req.body;
      const result = await messageService.changeVisibility(queueName, receiptHandle, visibilityTimeout);
      res.json(responseUtil.success(result, 'Message visibility updated successfully'));
    } catch (error) {
      next(error);
    }
  }

  async getAttributes(req, res, next) {
    try {
      const { queueName, receiptHandle } = req.params;
      const attributes = await messageService.getAttributes(queueName, receiptHandle);
      res.json(responseUtil.success(attributes));
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new MessageController();


