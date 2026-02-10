require('dotenv').config();

module.exports = {
  enabled: process.env.OAUTH_ENABLED === 'true',
  providers: {
    google: {
      enabled: process.env.GOOGLE_OAUTH_ENABLED === 'true',
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL || '/api/v1/oauth/google/callback',
      scope: ['profile', 'email']
    },
    github: {
      enabled: process.env.GITHUB_OAUTH_ENABLED === 'true',
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: process.env.GITHUB_CALLBACK_URL || '/api/v1/oauth/github/callback',
      scope: ['user:email']
    },
    microsoft: {
      enabled: process.env.MICROSOFT_OAUTH_ENABLED === 'true',
      clientId: process.env.MICROSOFT_CLIENT_ID,
      clientSecret: process.env.MICROSOFT_CLIENT_SECRET,
      callbackURL: process.env.MICROSOFT_CALLBACK_URL || '/api/v1/oauth/microsoft/callback',
      scope: ['openid', 'profile', 'email']
    }
  },
  defaultRedirect: process.env.OAUTH_DEFAULT_REDIRECT || '/',
  stateSecret: process.env.OAUTH_STATE_SECRET || 'change-this-secret'
};


