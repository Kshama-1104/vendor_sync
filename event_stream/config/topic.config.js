require('dotenv').config();

module.exports = {
  default: {
    partitions: 3,
    replicationFactor: 1,
    retentionMs: 604800000, // 7 days
    segmentSize: 1073741824, // 1 GB
    compression: 'none',
    cleanupPolicy: 'delete' // delete, compact
  },
  cleanup: {
    delete: {
      enabled: true,
      retentionMs: 604800000
    },
    compact: {
      enabled: false,
      minCleanableRatio: 0.5
    }
  },
  ordering: {
    guaranteeOrdering: process.env.GUARANTEE_ORDERING === 'true',
    orderingScope: process.env.ORDERING_SCOPE || 'partition' // partition, topic, global
  }
};


