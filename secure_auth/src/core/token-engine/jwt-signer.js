const jwt = require('jsonwebtoken');
const authConfig = require('../../../config/auth.config');

class JWTSigner {
  async sign(payload, options = {}) {
    return jwt.sign(payload, authConfig.jwt.secret, {
      algorithm: authConfig.jwt.algorithm,
      issuer: options.issuer || authConfig.jwt.issuer,
      audience: options.audience || authConfig.jwt.audience,
      expiresIn: options.expiresIn || authConfig.jwt.accessTokenExpiresIn,
      ...options
    });
  }
}

module.exports = new JWTSigner();


