require('dotenv').config();

module.exports = {
  default: {
    maxMessageSize: parseInt(process.env.MAX_MESSAGE_SIZE) || 262144, // 256 KB
    messageRetentionPeriod: parseInt(process.env.MESSAGE_RETENTION_PERIOD) || 345600, // 4 days
    visibilityTimeout: parseInt(process.env.VISIBILITY_TIMEOUT) || 30, // seconds
    receiveMessageWaitTime: parseInt(process.env.RECEIVE_MESSAGE_WAIT_TIME) || 0, // seconds
    maxReceiveCount: parseInt(process.env.MAX_RECEIVE_COUNT) || 3,
    fifo: process.env.DEFAULT_FIFO === 'true',
    delaySeconds: parseInt(process.env.DEFAULT_DELAY_SECONDS) || 0
  },
  types: {
    standard: {
      fifo: false,
      priority: false,
      delay: false
    },
    priority: {
      fifo: false,
      priority: true,
      maxPriority: 10,
      defaultPriority: 5
    },
    delay: {
      fifo: false,
      priority: false,
      delay: true,
      maxDelay: 900 // 15 minutes
    },
    fifo: {
      fifo: true,
      priority: false,
      delay: false,
      messageGroupId: true,
      deduplication: true
    }
  },
  delivery: {
    atLeastOnce: {
      enabled: true,
      default: true
    },
    exactlyOnce: {
      enabled: true,
      requiresFifo: true
    }
  },
  dlq: {
    enabled: true,
    defaultRetentionPeriod: 345600, // 4 days
    autoCreate: true
  },
  partitioning: {
    enabled: true,
    defaultPartitions: 4,
    strategy: 'hash' // hash, round-robin, priority
  }
};


