const logger = require('../../core/logger');
const brokerManager = require('../../core/broker/broker-manager');
const topicService = require('./topic.service');

class MetricsService {
  async getAllMetrics() {
    try {
      const systemMetrics = await this.getSystemMetrics();
      const topicsMetrics = await this.getAllTopicsMetrics();
      
      return {
        system: systemMetrics.system,
        topics: topicsMetrics.topics,
        uptime: process.uptime(),
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      logger.error('Error getting all metrics:', error);
      throw error;
    }
  }

  async getAllTopicsMetrics() {
    try {
      const topics = await topicService.list();
      const topicsMetrics = [];
      
      for (const topic of topics) {
        const stats = await brokerManager.getTopicStats(topic.name);
        topicsMetrics.push({
          name: topic.name,
          partitions: topic.partitions,
          totalEvents: stats.totalEvents || 0,
          eventsPerSecond: stats.eventsPerSecond || 0,
          createdAt: topic.createdAt
        });
      }
      
      return {
        topics: topicsMetrics,
        totalTopics: topics.length
      };
    } catch (error) {
      logger.error('Error getting all topics metrics:', error);
      throw error;
    }
  }

  async getTopicMetrics(topicName) {
    try {
      const stats = await brokerManager.getTopicStats(topicName);
      return {
        topicName,
        metrics: {
          totalEvents: stats.totalEvents || 0,
          eventsPerSecond: stats.eventsPerSecond || 0,
          averageLatency: stats.averageLatency || 0,
          partitionCount: stats.partitionCount || 0,
          totalSize: stats.totalSize || 0
        }
      };
    } catch (error) {
      logger.error(`Error getting topic metrics for ${topicName}:`, error);
      throw error;
    }
  }

  async getConsumerMetrics(consumerGroup) {
    try {
      return {
        consumerGroup,
        metrics: {
          lag: 0,
          throughput: 0,
          activeConsumers: 0
        }
      };
    } catch (error) {
      logger.error(`Error getting consumer metrics for ${consumerGroup}:`, error);
      throw error;
    }
  }

  async getSystemMetrics() {
    try {
      const topics = await topicService.list();
      let totalEvents = 0;
      
      for (const topic of topics) {
        const stats = await brokerManager.getTopicStats(topic.name);
        totalEvents += stats.totalEvents || 0;
      }
      
      return {
        system: {
          totalTopics: topics.length,
          totalEvents: totalEvents,
          totalConsumers: 0,
          throughput: 0,
          latency: 0,
          uptime: process.uptime(),
          memoryUsage: process.memoryUsage(),
          nodeVersion: process.version
        }
      };
    } catch (error) {
      logger.error('Error getting system metrics:', error);
      throw error;
    }
  }
}

module.exports = new MetricsService();


