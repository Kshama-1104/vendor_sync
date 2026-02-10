require('dotenv').config();

module.exports = {
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT) || 6379,
    password: process.env.REDIS_PASSWORD || null,
    db: 0,
    retryStrategy: (times) => {
      const delay = Math.min(times * 50, 2000);
      return delay;
    },
    maxRetriesPerRequest: 3
  },
  ttl: {
    vendor: 3600, // 1 hour
    product: 1800, // 30 minutes
    inventory: 300, // 5 minutes
    pricing: 1800, // 30 minutes
    syncStatus: 60 // 1 minute
  },
  keys: {
    vendor: (id) => `vendor:${id}`,
    product: (vendorId, sku) => `product:${vendorId}:${sku}`,
    inventory: (productId) => `inventory:${productId}`,
    pricing: (productId) => `pricing:${productId}`,
    syncStatus: (vendorId, type) => `sync:${vendorId}:${type}`
  }
};


