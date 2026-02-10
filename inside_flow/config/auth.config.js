require('dotenv').config();

module.exports = {
  jwt: {
    secret: process.env.JWT_SECRET || 'change-this-secret-in-production',
    expiresIn: process.env.JWT_EXPIRES_IN || '24h',
    algorithm: 'HS256'
  },
  roles: {
    admin: ['*'],
    flowManager: ['read:all', 'write:flow', 'execute:flow', 'manage:state'],
    flowViewer: ['read:all'],
    operator: ['execute:flow', 'read:own']
  },
  permissions: {
    'read:all': 'Read all flows',
    'read:own': 'Read own flows',
    'write:flow': 'Create and update flows',
    'execute:flow': 'Execute flows',
    'manage:state': 'Manage flow states',
    'manage:rule': 'Manage flow rules',
    'admin:*': 'Full administrative access'
  }
};


