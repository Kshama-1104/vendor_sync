require('dotenv').config();

module.exports = {
  jwt: {
    secret: process.env.JWT_SECRET || 'change-this-secret-in-production',
    accessTokenExpiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN || '15m',
    refreshTokenExpiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN || '7d',
    algorithm: 'HS256',
    issuer: process.env.JWT_ISSUER || 'secure-auth',
    audience: process.env.JWT_AUDIENCE || 'secure-auth-api'
  },
  password: {
    minLength: parseInt(process.env.PASSWORD_MIN_LENGTH) || 12,
    requireUppercase: process.env.PASSWORD_REQUIRE_UPPERCASE !== 'false',
    requireLowercase: process.env.PASSWORD_REQUIRE_LOWERCASE !== 'false',
    requireNumbers: process.env.PASSWORD_REQUIRE_NUMBERS !== 'false',
    requireSpecialChars: process.env.PASSWORD_REQUIRE_SPECIAL !== 'false',
    bcryptRounds: parseInt(process.env.BCRYPT_ROUNDS) || 12
  },
  session: {
    duration: parseInt(process.env.SESSION_DURATION) || 86400000, // 24 hours
    extendedDuration: parseInt(process.env.SESSION_EXTENDED_DURATION) || 604800000, // 7 days
    inactivityTimeout: parseInt(process.env.SESSION_INACTIVITY_TIMEOUT) || 1800000, // 30 minutes
    maxConcurrent: parseInt(process.env.MAX_CONCURRENT_SESSIONS) || 5,
    secure: process.env.SESSION_SECURE === 'true',
    httpOnly: true,
    sameSite: 'strict'
  },
  mfa: {
    enabled: process.env.MFA_ENABLED === 'true',
    requiredForAdmin: process.env.MFA_REQUIRED_FOR_ADMIN === 'true',
    totpIssuer: process.env.TOTP_ISSUER || 'Secure Auth',
    backupCodesCount: parseInt(process.env.MFA_BACKUP_CODES_COUNT) || 10
  },
  oauth: {
    enabled: process.env.OAUTH_ENABLED === 'true',
    providers: {
      google: {
        enabled: process.env.GOOGLE_OAUTH_ENABLED === 'true',
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET
      },
      github: {
        enabled: process.env.GITHUB_OAUTH_ENABLED === 'true',
        clientId: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET
      }
    }
  }
};


