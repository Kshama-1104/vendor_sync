const logger = require('../logger');

class PartitionManager {
  constructor() {
    this.partitions = new Map();
  }

  createPartitions(queueName, partitionCount) {
    try {
      const partitions = [];
      for (let i = 0; i < partitionCount; i++) {
        partitions.push({
          id: i,
          queueName: `${queueName}-partition-${i}`,
          messageCount: 0
        });
      }

      this.partitions.set(queueName, partitions);
      logger.info(`Created ${partitionCount} partitions for queue ${queueName}`);
      return partitions;
    } catch (error) {
      logger.error(`Error creating partitions: ${error.message}`);
      throw error;
    }
  }

  getPartition(queueName, partitionKey) {
    try {
      const partitions = this.partitions.get(queueName);
      if (!partitions || partitions.length === 0) {
        return null;
      }

      // Hash-based partitioning
      if (partitionKey) {
        const hash = this.hash(partitionKey);
        const partitionIndex = hash % partitions.length;
        return partitions[partitionIndex];
      }

      // Round-robin
      const partition = partitions[this.roundRobinIndex % partitions.length];
      this.roundRobinIndex = (this.roundRobinIndex + 1) % partitions.length;
      return partition;
    } catch (error) {
      logger.error(`Error getting partition: ${error.message}`);
      throw error;
    }
  }

  hash(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash);
  }

  roundRobinIndex = 0;
}

module.exports = new PartitionManager();


