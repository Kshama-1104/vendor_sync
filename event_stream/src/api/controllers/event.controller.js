const producerService = require('../services/producer.service');
const consumerService = require('../services/consumer.service');
const responseUtil = require('../../utils/response.util');

class EventController {
  async produce(req, res, next) {
    try {
      const { topicName } = req.params;
      const eventData = req.body;
      const result = await producerService.produce(topicName, eventData);
      res.status(201).json(responseUtil.success(result, 'Event produced successfully'));
    } catch (error) {
      next(error);
    }
  }

  async produceBatch(req, res, next) {
    try {
      const { topicName } = req.params;
      const { events } = req.body;
      const result = await producerService.produceBatch(topicName, events);
      res.status(201).json(responseUtil.success(result, 'Events produced successfully'));
    } catch (error) {
      next(error);
    }
  }

  async consume(req, res, next) {
    try {
      const { topicName } = req.params;
      const { consumerGroup, partition, offset, maxEvents = 10 } = req.query;
      const events = await consumerService.consume(topicName, {
        consumerGroup,
        partition: partition ? parseInt(partition) : undefined,
        offset: offset ? parseInt(offset) : undefined,
        maxEvents: parseInt(maxEvents)
      });
      res.json(responseUtil.success(events));
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new EventController();


