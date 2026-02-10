const logger = require('../logger');

class PartitionAllocator {
  constructor() {
    this.partitions = new Map();
  }

  async initialize(topicName, partitionCount) {
    try {
      for (let i = 0; i < partitionCount; i++) {
        const partitionKey = `${topicName}:${i}`;
        this.partitions.set(partitionKey, {
          topic: topicName,
          partition: i,
          events: []
        });
      }
      logger.info(`Initialized ${partitionCount} partitions for topic ${topicName}`);
    } catch (error) {
      logger.error(`Error initializing partitions: ${error.message}`);
      throw error;
    }
  }

  async allocate(topicName, key) {
    try {
      const topicPartitions = Array.from(this.partitions.keys())
        .filter(k => k.startsWith(`${topicName}:`));

      if (topicPartitions.length === 0) {
        throw new Error(`No partitions found for topic ${topicName}`);
      }

      // Hash-based partitioning
      if (key) {
        const hash = this.hash(key);
        const partitionIndex = hash % topicPartitions.length;
        return partitionIndex;
      }

      // Round-robin if no key
      return this.roundRobinIndex % topicPartitions.length;
    } catch (error) {
      logger.error(`Error allocating partition: ${error.message}`);
      throw error;
    }
  }

  hash(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return Math.abs(hash);
  }

  roundRobinIndex = 0;
}

module.exports = new PartitionAllocator();


