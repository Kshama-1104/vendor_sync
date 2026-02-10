const crypto = require('crypto');
const logger = require('../logger');

class KeyManager {
  generateKey(length = 32) {
    return crypto.randomBytes(length).toString('hex');
  }

  rotateKey() {
    const newKey = this.generateKey();
    logger.info('Encryption key rotated');
    return newKey;
  }
}

module.exports = new KeyManager();


