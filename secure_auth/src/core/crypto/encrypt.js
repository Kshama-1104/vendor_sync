const crypto = require('crypto');

const algorithm = 'aes-256-gcm';
const keyLength = 32;

class Encrypt {
  constructor() {
    this.key = Buffer.from(process.env.ENCRYPTION_KEY || crypto.randomBytes(keyLength).toString('hex'), 'hex');
  }

  encrypt(text) {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(algorithm, this.key, iv);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    const tag = cipher.getAuthTag();
    return {
      encrypted,
      iv: iv.toString('hex'),
      tag: tag.toString('hex')
    };
  }

  decrypt(encryptedData) {
    const { encrypted, iv, tag } = encryptedData;
    const decipher = crypto.createDecipheriv(algorithm, this.key, Buffer.from(iv, 'hex'));
    decipher.setAuthTag(Buffer.from(tag, 'hex'));
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  }
}

module.exports = new Encrypt();


