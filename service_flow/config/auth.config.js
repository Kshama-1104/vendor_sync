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
  roles: {
    admin: ['*'],
    manager: ['read:all', 'write:service', 'manage:workflow', 'approve:all'],
    user: ['read:own', 'write:own', 'create:service'],
    approver: ['read:all', 'approve:assigned']
  },
  permissions: {
    'read:all': 'Read all services',
    'read:own': 'Read own services',
    'write:all': 'Write all services',
    'write:own': 'Write own services',
    'write:service': 'Write service requests',
    'create:service': 'Create service requests',
    'manage:workflow': 'Manage workflows',
    'approve:all': 'Approve any service',
    'approve:assigned': 'Approve assigned services',
    'admin:*': 'Full administrative access'
  }
};


