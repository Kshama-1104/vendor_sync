module.exports = {
  QUEUE_TYPES: {
    STANDARD: 'standard',
    PRIORITY: 'priority',
    DELAY: 'delay',
    FIFO: 'fifo'
  },
  MESSAGE_STATUS: {
    PENDING: 'pending',
    VISIBLE: 'visible',
    IN_FLIGHT: 'in-flight',
    PROCESSED: 'processed',
    FAILED: 'failed',
    DLQ: 'dlq'
  },
  WORKER_STATUS: {
    ACTIVE: 'active',
    IDLE: 'idle',
    PROCESSING: 'processing',
    INACTIVE: 'inactive',
    ERROR: 'error'
  },
  DELIVERY_MODES: {
    AT_LEAST_ONCE: 'at-least-once',
    EXACTLY_ONCE: 'exactly-once'
  },
  MAX_MESSAGE_SIZE: 262144, // 256 KB
  MAX_BATCH_SIZE: 10,
  DEFAULT_VISIBILITY_TIMEOUT: 30, // seconds
  DEFAULT_RETENTION_PERIOD: 345600, // 4 days in seconds
  DEFAULT_MAX_RECEIVE_COUNT: 3
};


