const logger = require('../../core/logger');
const brokerManager = require('../../core/broker/broker-manager');
const checkpointManager = require('../../core/stream-engine/checkpoint-manager');

class ConsumerService {
  constructor() {
    this.consumerGroups = new Map();
    this.offsets = new Map();
  }

  async createGroup(groupData) {
    try {
      const group = {
        name: groupData.name,
        topics: groupData.topics || [],
        createdAt: new Date()
      };

      this.consumerGroups.set(group.name, group);
      logger.info(`Consumer group created: ${group.name}`);
      return group;
    } catch (error) {
      logger.error('Error creating consumer group:', error);
      throw error;
    }
  }

  async getGroup(name) {
    return this.consumerGroups.get(name) || null;
  }

  async listGroups() {
    return Array.from(this.consumerGroups.values());
  }

  async consume(topicName, options = {}) {
    try {
      const {
        consumerGroup,
        partition,
        offset,
        maxEvents = 10
      } = options;

      // Get current offset if not provided
      let currentOffset = offset;
      if (!currentOffset && consumerGroup) {
        currentOffset = await this.getOffset(consumerGroup, topicName, partition);
      }

      // Consume events from broker
      const events = await brokerManager.consume(topicName, partition, currentOffset, maxEvents);

      // Update offset
      if (consumerGroup && events.length > 0) {
        const lastOffset = events[events.length - 1].offset;
        await this.setOffset(consumerGroup, topicName, partition, lastOffset + 1);
      }

      logger.info(`Consumed ${events.length} events from topic ${topicName}`);
      return events;
    } catch (error) {
      logger.error(`Error consuming events from topic ${topicName}:`, error);
      throw error;
    }
  }

  async commitOffset(consumerGroup, topic, partition, offset) {
    try {
      await this.setOffset(consumerGroup, topic, partition, offset);
      await checkpointManager.save(consumerGroup, topic, partition, offset);
      logger.info(`Offset committed: ${consumerGroup} ${topic}:${partition} = ${offset}`);
      return true;
    } catch (error) {
      logger.error('Error committing offset:', error);
      throw error;
    }
  }

  async getOffsets(consumerGroup) {
    try {
      const offsets = [];
      const group = await this.getGroup(consumerGroup);
      if (!group) {
        throw new Error('Consumer group not found');
      }

      for (const topic of group.topics) {
        const topicOffsets = await checkpointManager.get(consumerGroup, topic);
        offsets.push(...topicOffsets);
      }

      return offsets;
    } catch (error) {
      logger.error('Error getting offsets:', error);
      throw error;
    }
  }

  async getOffset(consumerGroup, topic, partition) {
    const key = `${consumerGroup}:${topic}:${partition}`;
    return this.offsets.get(key) || 0;
  }

  async setOffset(consumerGroup, topic, partition, offset) {
    const key = `${consumerGroup}:${topic}:${partition}`;
    this.offsets.set(key, offset);
  }
}

module.exports = new ConsumerService();


