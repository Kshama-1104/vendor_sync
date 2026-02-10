const logger = require('../logger');

class RefreshManager {
  constructor() {
    this.tokens = new Map();
  }

  async store(userId, token) {
    this.tokens.set(token, {
      userId,
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    });
  }

  async verify(token) {
    const tokenData = this.tokens.get(token);
    if (!tokenData) {
      return null;
    }

    if (new Date(tokenData.expiresAt) < new Date()) {
      this.tokens.delete(token);
      return null;
    }

    return tokenData;
  }

  async revoke(token) {
    this.tokens.delete(token);
    logger.debug('Refresh token revoked');
  }
}

module.exports = new RefreshManager();


