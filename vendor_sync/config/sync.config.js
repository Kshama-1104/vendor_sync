require('dotenv').config();

module.exports = {
  batchSize: parseInt(process.env.SYNC_BATCH_SIZE) || 1000,
  retryAttempts: parseInt(process.env.SYNC_RETRY_ATTEMPTS) || 3,
  retryDelay: parseInt(process.env.SYNC_RETRY_DELAY_MS) || 5000,
  timeout: parseInt(process.env.SYNC_TIMEOUT_MS) || 30000,
  schedules: {
    realtime: {
      enabled: true,
      priority: 10
    },
    hourly: {
      enabled: true,
      cron: '0 * * * *', // Every hour
      priority: 5
    },
    daily: {
      enabled: true,
      cron: '0 0 * * *', // Daily at midnight
      priority: 3
    },
    weekly: {
      enabled: true,
      cron: '0 0 * * 0', // Weekly on Sunday
      priority: 1
    }
  },
  types: {
    inventory: {
      enabled: true,
      batchSize: 1000,
      timeout: 30000
    },
    pricing: {
      enabled: true,
      batchSize: 500,
      timeout: 30000
    },
    order: {
      enabled: true,
      batchSize: 100,
      timeout: 60000
    },
    catalog: {
      enabled: true,
      batchSize: 2000,
      timeout: 120000
    }
  },
  conflictResolution: {
    strategy: 'last-write-wins', // last-write-wins, source-priority, manual-review, merge
    sourcePriority: ['vendor', 'internal'],
    enableManualReview: true
  },
  validation: {
    strict: true,
    allowPartial: false,
    requireSchema: true
  }
};


