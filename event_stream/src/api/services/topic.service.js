const logger = require('../../core/logger');
const brokerManager = require('../../core/broker/broker-manager');
const partitionAllocator = require('../../core/broker/partition-allocator');

class TopicService {
  constructor() {
    this.topics = new Map();
  }

  async create(topicData) {
    try {
      const topic = {
        name: topicData.name,
        partitions: topicData.partitions || 3,
        replicationFactor: topicData.replicationFactor || 1,
        retentionMs: topicData.retentionMs || 604800000,
        createdAt: new Date()
      };

      this.topics.set(topic.name, topic);

      // Create topic in broker
      await brokerManager.createTopic(topic.name, topic);

      // Initialize partitions
      await partitionAllocator.initialize(topic.name, topic.partitions);

      logger.info(`Topic created: ${topic.name}`);
      return topic;
    } catch (error) {
      logger.error('Error creating topic:', error);
      throw error;
    }
  }

  async get(name) {
    try {
      const topic = this.topics.get(name);
      if (!topic) {
        return null;
      }

      const stats = await brokerManager.getTopicStats(name);
      return {
        ...topic,
        ...stats
      };
    } catch (error) {
      logger.error(`Error getting topic ${name}:`, error);
      throw error;
    }
  }

  async list() {
    return Array.from(this.topics.values());
  }

  async update(name, topicData) {
    try {
      const topic = this.topics.get(name);
      if (!topic) {
        throw new Error('Topic not found');
      }

      Object.assign(topic, topicData, { updatedAt: new Date() });
      await brokerManager.updateTopic(name, topic);

      logger.info(`Topic updated: ${name}`);
      return topic;
    } catch (error) {
      logger.error(`Error updating topic ${name}:`, error);
      throw error;
    }
  }

  async delete(name) {
    try {
      const topic = this.topics.get(name);
      if (!topic) {
        throw new Error('Topic not found');
      }

      await brokerManager.deleteTopic(name);
      this.topics.delete(name);

      logger.info(`Topic deleted: ${name}`);
      return true;
    } catch (error) {
      logger.error(`Error deleting topic ${name}:`, error);
      throw error;
    }
  }
}

module.exports = new TopicService();


