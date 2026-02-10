const jwt = require('jsonwebtoken');
const authConfig = require('../../../config/auth.config');
const encryption = require('./encryption');

class TokenManager {
  generateAccessToken(payload) {
    return jwt.sign(payload, authConfig.jwt.secret, {
      expiresIn: authConfig.jwt.expiresIn,
      algorithm: authConfig.jwt.algorithm
    });
  }

  generateRefreshToken(payload) {
    return jwt.sign(payload, authConfig.jwt.refreshSecret, {
      expiresIn: authConfig.jwt.refreshExpiresIn,
      algorithm: authConfig.jwt.algorithm
    });
  }

  verifyAccessToken(token) {
    try {
      return jwt.verify(token, authConfig.jwt.secret);
    } catch (error) {
      throw new Error('Invalid or expired access token');
    }
  }

  verifyRefreshToken(token) {
    try {
      return jwt.verify(token, authConfig.jwt.refreshSecret);
    } catch (error) {
      throw new Error('Invalid or expired refresh token');
    }
  }

  decodeToken(token) {
    return jwt.decode(token);
  }
}

module.exports = new TokenManager();


