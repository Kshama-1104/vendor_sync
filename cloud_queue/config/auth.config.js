require('dotenv').config();

module.exports = {
  jwt: {
    secret: process.env.JWT_SECRET || 'change-this-secret-in-production',
    expiresIn: process.env.JWT_EXPIRES_IN || '24h',
    algorithm: 'HS256'
  },
  apiKey: {
    length: 32,
    prefix: 'cq_',
    expiresIn: null // null = never expires
  },
  roles: {
    admin: ['*'],
    producer: ['publish:all', 'read:own'],
    consumer: ['consume:all', 'read:own'],
    operator: ['manage:queues', 'read:all']
  },
  permissions: {
    'publish:all': 'Publish to any queue',
    'publish:own': 'Publish to own queues',
    'consume:all': 'Consume from any queue',
    'consume:own': 'Consume from own queues',
    'manage:queues': 'Manage queues',
    'read:all': 'Read all resources',
    'read:own': 'Read own resources',
    'admin:*': 'Full administrative access'
  }
};


