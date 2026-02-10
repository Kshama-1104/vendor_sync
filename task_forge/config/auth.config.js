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
  oauth: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      enabled: process.env.GOOGLE_OAUTH_ENABLED === 'true'
    },
    github: {
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      enabled: process.env.GITHUB_OAUTH_ENABLED === 'true'
    }
  },
  roles: {
    admin: ['*'],
    manager: ['read:all', 'write:workspace', 'manage:team'],
    user: ['read:own', 'write:own']
  },
  permissions: {
    'read:all': 'Read all resources',
    'read:own': 'Read own resources',
    'write:all': 'Write all resources',
    'write:own': 'Write own resources',
    'write:workspace': 'Write workspace resources',
    'manage:team': 'Manage team members',
    'admin:*': 'Full administrative access'
  }
};


