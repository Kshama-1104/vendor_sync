const jwt = require('jsonwebtoken');
const authConfig = require('../../../config/auth.config');
const tokenConfig = require('../../../config/token.config');

class TokenValidator {
  async validate(token) {
    const options = {
      algorithms: [tokenConfig.accessToken.algorithm],
      issuer: tokenConfig.validation.checkIssuer ? tokenConfig.accessToken.issuer : undefined,
      audience: tokenConfig.validation.checkAudience ? tokenConfig.accessToken.audience : undefined
    };

    try {
      const decoded = jwt.verify(token, authConfig.jwt.secret, options);
      
      if (tokenConfig.validation.checkExpiration && decoded.exp && decoded.exp < Date.now() / 1000) {
        throw new Error('Token expired');
      }

      return decoded;
    } catch (error) {
      throw new Error('Invalid token');
    }
  }
}

module.exports = new TokenValidator();


