require('dotenv').config();

module.exports = {
  default: {
    retentionMs: parseInt(process.env.DEFAULT_RETENTION_MS) || 604800000, // 7 days
    segmentSize: parseInt(process.env.DEFAULT_SEGMENT_SIZE) || 1073741824, // 1 GB
    maxSegmentAge: parseInt(process.env.MAX_SEGMENT_AGE) || 86400000 // 1 day
  },
  policies: {
    timeBased: {
      enabled: true,
      retentionMs: 604800000
    },
    sizeBased: {
      enabled: false,
      maxSize: 10737418240 // 10 GB
    },
    eventCount: {
      enabled: false,
      maxEvents: 1000000
    }
  },
  compaction: {
    enabled: process.env.COMPACTION_ENABLED === 'true',
    minCleanableRatio: parseFloat(process.env.MIN_CLEANABLE_RATIO) || 0.5
  }
};


