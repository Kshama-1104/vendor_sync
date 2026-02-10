require('dotenv').config();

module.exports = {
  default: {
    concurrency: parseInt(process.env.WORKER_CONCURRENCY) || 10,
    maxRetries: parseInt(process.env.MAX_RETRIES) || 3,
    retryDelay: parseInt(process.env.RETRY_DELAY) || 1000,
    heartbeatInterval: parseInt(process.env.HEARTBEAT_INTERVAL) || 30000,
    maxProcessingTime: parseInt(process.env.MAX_PROCESSING_TIME) || 300000
  },
  scaling: {
    enabled: process.env.AUTO_SCALING_ENABLED === 'true',
    minWorkers: parseInt(process.env.MIN_WORKERS) || 1,
    maxWorkers: parseInt(process.env.MAX_WORKERS) || 10,
    scaleUpThreshold: parseInt(process.env.SCALE_UP_THRESHOLD) || 100,
    scaleDownThreshold: parseInt(process.env.SCALE_DOWN_THRESHOLD) || 10,
    cooldownPeriod: parseInt(process.env.COOLDOWN_PERIOD) || 300
  },
  health: {
    checkInterval: parseInt(process.env.HEALTH_CHECK_INTERVAL) || 60000,
    unhealthyThreshold: parseInt(process.env.UNHEALTHY_THRESHOLD) || 3,
    autoRestart: process.env.AUTO_RESTART === 'true'
  }
};


