require('dotenv').config();

module.exports = {
  mode: {
    sync: {
      enabled: true,
      default: true
    },
    async: {
      enabled: true,
      default: false
    },
    parallel: {
      enabled: process.env.PARALLEL_EXECUTION_ENABLED === 'true',
      maxConcurrent: parseInt(process.env.MAX_PARALLEL_EXECUTIONS) || 10
    }
  },
  timeout: {
    flow: parseInt(process.env.FLOW_TIMEOUT) || 3600000, // 1 hour
    state: parseInt(process.env.STATE_TIMEOUT) || 300000, // 5 minutes
    action: parseInt(process.env.ACTION_TIMEOUT) || 60000, // 1 minute
    rule: parseInt(process.env.RULE_TIMEOUT) || 5000 // 5 seconds
  },
  retry: {
    enabled: true,
    maxRetries: parseInt(process.env.MAX_RETRIES) || 3,
    retryDelay: parseInt(process.env.RETRY_DELAY) || 1000,
    backoffMultiplier: parseFloat(process.env.BACKOFF_MULTIPLIER) || 2
  },
  errorHandling: {
    enableErrorRecovery: process.env.ENABLE_ERROR_RECOVERY === 'true',
    enableFallback: process.env.ENABLE_FALLBACK === 'true',
    enableGracefulDegradation: process.env.ENABLE_GRACEFUL_DEGRADATION === 'true'
  },
  monitoring: {
    enableExecutionLogging: true,
    enablePerformanceTracking: true,
    enableMetricsCollection: true
  }
};


