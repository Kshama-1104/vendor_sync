const crypto = require('crypto');

const algorithm = 'aes-256-gcm';
const keyLength = 32;
const ivLength = 16;
const saltLength = 64;
const tagLength = 16;

class Encryption {
  constructor() {
    this.key = process.env.ENCRYPTION_KEY || this.generateKey();
  }

  generateKey() {
    return crypto.randomBytes(keyLength).toString('hex');
  }

  encrypt(text) {
    try {
      const iv = crypto.randomBytes(ivLength);
      const cipher = crypto.createCipheriv(algorithm, Buffer.from(this.key, 'hex'), iv);

      let encrypted = cipher.update(text, 'utf8', 'hex');
      encrypted += cipher.final('hex');

      const tag = cipher.getAuthTag();

      return {
        encrypted,
        iv: iv.toString('hex'),
        tag: tag.toString('hex')
      };
    } catch (error) {
      throw new Error(`Encryption failed: ${error.message}`);
    }
  }

  decrypt(encryptedData) {
    try {
      const { encrypted, iv, tag } = encryptedData;
      const decipher = crypto.createDecipheriv(
        algorithm,
        Buffer.from(this.key, 'hex'),
        Buffer.from(iv, 'hex')
      );

      decipher.setAuthTag(Buffer.from(tag, 'hex'));

      let decrypted = decipher.update(encrypted, 'hex', 'utf8');
      decrypted += decipher.final('utf8');

      return decrypted;
    } catch (error) {
      throw new Error(`Decryption failed: ${error.message}`);
    }
  }

  hash(text) {
    return crypto.createHash('sha256').update(text).digest('hex');
  }
}

module.exports = new Encryption();


