require('dotenv').config();

module.exports = {
  jwt: {
    secret: process.env.JWT_SECRET || 'change-this-secret-in-production',
    expiresIn: process.env.JWT_EXPIRES_IN || '24h',
    algorithm: 'HS256'
  },
  roles: {
    admin: ['*'],
    producer: ['produce:all', 'read:topics'],
    consumer: ['consume:all', 'read:topics'],
    operator: ['manage:topics', 'read:all']
  },
  permissions: {
    'produce:all': 'Produce to any topic',
    'produce:own': 'Produce to own topics',
    'consume:all': 'Consume from any topic',
    'consume:own': 'Consume from own topics',
    'manage:topics': 'Manage topics',
    'read:all': 'Read all resources',
    'read:topics': 'Read topic metadata',
    'admin:*': 'Full administrative access'
  }
};


