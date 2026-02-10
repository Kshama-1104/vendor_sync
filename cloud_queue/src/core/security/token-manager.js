const jwt = require('jsonwebtoken');
const authConfig = require('../../../config/auth.config');
const crypto = require('crypto');

class TokenManager {
  generateAccessToken(payload) {
    return jwt.sign(payload, authConfig.jwt.secret, {
      expiresIn: authConfig.jwt.expiresIn,
      algorithm: authConfig.jwt.algorithm
    });
  }

  verifyToken(token) {
    try {
      return jwt.verify(token, authConfig.jwt.secret);
    } catch (error) {
      throw new Error('Invalid token');
    }
  }

  generateAPIKey() {
    const randomBytes = crypto.randomBytes(16);
    const key = randomBytes.toString('hex');
    return `${authConfig.apiKey.prefix}${key}`;
  }

  validateAPIKey(apiKey) {
    if (!apiKey || !apiKey.startsWith(authConfig.apiKey.prefix)) {
      return false;
    }
    return apiKey.length === authConfig.apiKey.prefix.length + authConfig.apiKey.length * 2;
  }
}

module.exports = new TokenManager();


