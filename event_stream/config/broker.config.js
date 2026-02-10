require('dotenv').config();

module.exports = {
  default: {
    partitions: parseInt(process.env.DEFAULT_PARTITIONS) || 3,
    replicationFactor: parseInt(process.env.DEFAULT_REPLICATION_FACTOR) || 1,
    retentionMs: parseInt(process.env.DEFAULT_RETENTION_MS) || 604800000, // 7 days
    segmentSize: parseInt(process.env.DEFAULT_SEGMENT_SIZE) || 1073741824, // 1 GB
    compression: process.env.DEFAULT_COMPRESSION || 'none'
  },
  replication: {
    enabled: process.env.REPLICATION_ENABLED === 'true',
    minInSyncReplicas: parseInt(process.env.MIN_IN_SYNC_REPLICAS) || 1,
    acks: process.env.REPLICATION_ACKS || 'all'
  },
  partitioning: {
    strategy: process.env.PARTITIONING_STRATEGY || 'hash', // hash, round-robin, custom
    keyRequired: process.env.PARTITION_KEY_REQUIRED === 'true'
  }
};


