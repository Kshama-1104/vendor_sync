require('dotenv').config();

module.exports = {
  processing: {
    enabled: process.env.STREAM_PROCESSING_ENABLED === 'true',
    parallelism: parseInt(process.env.STREAM_PARALLELISM) || 1,
    bufferSize: parseInt(process.env.STREAM_BUFFER_SIZE) || 1000,
    flushInterval: parseInt(process.env.STREAM_FLUSH_INTERVAL) || 1000
  },
  windows: {
    timeWindow: {
      enabled: true,
      defaultSize: parseInt(process.env.DEFAULT_TIME_WINDOW_SIZE) || 60000 // 1 minute
    },
    countWindow: {
      enabled: true,
      defaultSize: parseInt(process.env.DEFAULT_COUNT_WINDOW_SIZE) || 100
    },
    sessionWindow: {
      enabled: true,
      inactivityGap: parseInt(process.env.SESSION_INACTIVITY_GAP) || 300000 // 5 minutes
    }
  },
  state: {
    storeType: process.env.STATE_STORE_TYPE || 'memory', // memory, redis, database
    ttl: parseInt(process.env.STATE_TTL) || 3600000, // 1 hour
    checkpointInterval: parseInt(process.env.CHECKPOINT_INTERVAL) || 60000 // 1 minute
  }
};


