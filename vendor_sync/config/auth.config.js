require('dotenv').config();

module.exports = {
  jwt: {
    secret: process.env.JWT_SECRET || 'change-this-secret-in-production',
    expiresIn: process.env.JWT_EXPIRES_IN || '24h',
    refreshSecret: process.env.JWT_REFRESH_SECRET || 'change-this-refresh-secret',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
    algorithm: 'HS256'
  },
  bcrypt: {
    saltRounds: 12
  },
  apiKey: {
    length: 32,
    prefix: 'vs_',
    expiresIn: null // null = never expires
  },
  roles: {
    admin: ['*'],
    vendor: ['read:own', 'write:own', 'sync:own'],
    user: ['read:all'],
    operator: ['sync:all', 'read:all']
  },
  permissions: {
    'read:all': 'Read all resources',
    'read:own': 'Read own resources',
    'write:all': 'Write all resources',
    'write:own': 'Write own resources',
    'sync:all': 'Sync all vendors',
    'sync:own': 'Sync own vendor',
    'admin:*': 'Full administrative access'
  }
};


