const logger = require('../logger');

class BrokerManager {
  constructor() {
    this.topics = new Map();
    this.partitions = new Map();
    this.events = new Map();
  }

  async createTopic(name, config) {
    try {
      const topic = {
        name,
        config,
        partitions: [],
        createdAt: new Date()
      };

      this.topics.set(name, topic);
      logger.info(`Topic created in broker: ${name}`);
      return topic;
    } catch (error) {
      logger.error(`Error creating topic in broker: ${error.message}`);
      throw error;
    }
  }

  async produce(topicName, partition, event) {
    try {
      const partitionKey = `${topicName}:${partition}`;
      let partitionData = this.partitions.get(partitionKey);

      if (!partitionData) {
        partitionData = {
          topic: topicName,
          partition,
          events: [],
          offset: 0
        };
        this.partitions.set(partitionKey, partitionData);
      }

      event.offset = partitionData.offset++;
      partitionData.events.push(event);
      this.events.set(event.id, event);

      logger.debug(`Event produced: ${event.id} to partition ${partitionKey} at offset ${event.offset}`);
      return event;
    } catch (error) {
      logger.error(`Error producing event: ${error.message}`);
      throw error;
    }
  }

  async consume(topicName, partition, offset, maxEvents) {
    try {
      const partitionKey = `${topicName}:${partition}`;
      const partitionData = this.partitions.get(partitionKey);

      if (!partitionData) {
        return [];
      }

      const events = partitionData.events.filter(e => e.offset >= offset).slice(0, maxEvents);
      logger.debug(`Consumed ${events.length} events from partition ${partitionKey} starting at offset ${offset}`);
      return events;
    } catch (error) {
      logger.error(`Error consuming events: ${error.message}`);
      throw error;
    }
  }

  async getTopicStats(topicName) {
    const topic = this.topics.get(topicName);
    if (!topic) {
      return null;
    }

    let totalEvents = 0;
    let totalSize = 0;

    for (const [key, partition] of this.partitions) {
      if (key.startsWith(`${topicName}:`)) {
        totalEvents += partition.events.length;
        totalSize += JSON.stringify(partition.events).length;
      }
    }

    return {
      totalEvents,
      totalSize,
      partitionCount: topic.config.partitions,
      eventsPerSecond: 0,
      averageLatency: 0
    };
  }

  async updateTopic(name, config) {
    const topic = this.topics.get(name);
    if (topic) {
      topic.config = { ...topic.config, ...config };
    }
    return topic;
  }

  async deleteTopic(name) {
    this.topics.delete(name);
    // Delete all partitions for this topic
    for (const [key] of this.partitions) {
      if (key.startsWith(`${name}:`)) {
        this.partitions.delete(key);
      }
    }
    logger.info(`Topic deleted from broker: ${name}`);
    return true;
  }
}

module.exports = new BrokerManager();


