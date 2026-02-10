require('dotenv').config();

module.exports = {
  strategy: process.env.RETRY_STRATEGY || 'exponential', // exponential, linear, fixed
  maxRetries: parseInt(process.env.MAX_RETRIES) || 3,
  initialDelay: parseInt(process.env.RETRY_INITIAL_DELAY) || 1000, // milliseconds
  maxDelay: parseInt(process.env.RETRY_MAX_DELAY) || 300000, // 5 minutes
  backoffMultiplier: parseFloat(process.env.RETRY_BACKOFF_MULTIPLIER) || 2,
  jitter: process.env.RETRY_JITTER === 'true',
  dlq: {
    enabled: true,
    maxReceiveCount: parseInt(process.env.MAX_RECEIVE_COUNT) || 3,
    autoCreate: true
  },
  exponential: {
    initialDelay: 1000,
    maxDelay: 300000,
    multiplier: 2
  },
  linear: {
    initialDelay: 1000,
    increment: 1000,
    maxDelay: 300000
  },
  fixed: {
    delay: 5000
  }
};


