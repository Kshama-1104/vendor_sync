require('dotenv').config();

module.exports = {
  accessToken: {
    expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN || '15m',
    algorithm: 'HS256',
    issuer: process.env.JWT_ISSUER || 'secure-auth',
    audience: process.env.JWT_AUDIENCE || 'secure-auth-api'
  },
  refreshToken: {
    expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN || '7d',
    rotationEnabled: process.env.REFRESH_TOKEN_ROTATION === 'true',
    reuseDetection: process.env.REFRESH_TOKEN_REUSE_DETECTION === 'true'
  },
  blacklist: {
    enabled: true,
    ttl: parseInt(process.env.TOKEN_BLACKLIST_TTL) || 86400000, // 24 hours
    cleanupInterval: parseInt(process.env.TOKEN_BLACKLIST_CLEANUP_INTERVAL) || 3600000 // 1 hour
  },
  validation: {
    checkExpiration: true,
    checkIssuer: true,
    checkAudience: true,
    checkSignature: true,
    allowExpired: false
  }
};


