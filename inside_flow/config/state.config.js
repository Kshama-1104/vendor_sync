require('dotenv').config();

module.exports = {
  types: {
    start: {
      allowed: true,
      maxPerFlow: 1
    },
    normal: {
      allowed: true,
      maxPerFlow: 100
    },
    decision: {
      allowed: true,
      maxPerFlow: 50
    },
    parallel: {
      allowed: true,
      maxPerFlow: 20
    },
    end: {
      allowed: true,
      maxPerFlow: 10
    }
  },
  lifecycle: {
    enableEntryActions: true,
    enableExitActions: true,
    enableErrorHandling: true,
    enableStateValidation: true
  },
  validation: {
    enableTransitionValidation: true,
    enableStateValidation: true,
    enableDataValidation: true
  },
  caching: {
    enabled: process.env.STATE_CACHING_ENABLED === 'true',
    ttl: parseInt(process.env.STATE_CACHE_TTL) || 3600, // 1 hour
    maxSize: parseInt(process.env.STATE_CACHE_MAX_SIZE) || 1000
  }
};


