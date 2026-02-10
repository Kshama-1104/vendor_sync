require('dotenv').config();

module.exports = {
  execution: {
    maxConcurrentFlows: parseInt(process.env.MAX_CONCURRENT_FLOWS) || 100,
    maxExecutionTime: parseInt(process.env.MAX_EXECUTION_TIME) || 3600000, // 1 hour
    enableParallelExecution: process.env.ENABLE_PARALLEL_EXECUTION === 'true',
    enableRollback: process.env.ENABLE_ROLLBACK === 'true'
  },
  states: {
    maxStatesPerFlow: parseInt(process.env.MAX_STATES_PER_FLOW) || 100,
    defaultTimeout: parseInt(process.env.STATE_DEFAULT_TIMEOUT) || 300000, // 5 minutes
    enableStateCaching: process.env.ENABLE_STATE_CACHING === 'true'
  },
  transitions: {
    maxTransitionsPerState: parseInt(process.env.MAX_TRANSITIONS_PER_STATE) || 10,
    defaultTimeout: parseInt(process.env.TRANSITION_DEFAULT_TIMEOUT) || 60000, // 1 minute
    enableTransitionCaching: process.env.ENABLE_TRANSITION_CACHING === 'true'
  },
  data: {
    maxContextSize: parseInt(process.env.MAX_CONTEXT_SIZE) || 10485760, // 10 MB
    enableDataCompression: process.env.ENABLE_DATA_COMPRESSION === 'true',
    enableDataEncryption: process.env.ENABLE_DATA_ENCRYPTION === 'true'
  },
  retry: {
    maxRetries: parseInt(process.env.MAX_RETRIES) || 3,
    retryDelay: parseInt(process.env.RETRY_DELAY) || 1000,
    backoffMultiplier: parseFloat(process.env.BACKOFF_MULTIPLIER) || 2
  }
};


