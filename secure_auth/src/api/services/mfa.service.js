const speakeasy = require('speakeasy');
const QRCode = require('qrcode');
const logger = require('../../core/logger');
const mfaConfig = require('../../../config/mfa.config');

class MFAService {
  constructor() {
    this.totpSecrets = new Map();
    this.backupCodes = new Map();
  }

  async setup(userId) {
    try {
      // Generate TOTP secret
      const secret = speakeasy.generateSecret({
        name: `${mfaConfig.methods.totp.issuer} (${userId})`,
        issuer: mfaConfig.methods.totp.issuer
      });

      // Store secret
      this.totpSecrets.set(userId, secret.base32);

      // Generate backup codes
      const codes = this.generateBackupCodes();

      // Store backup codes
      this.backupCodes.set(userId, codes);

      // Generate QR code
      const qrCodeUrl = await QRCode.toDataURL(secret.otpauth_url);

      logger.info(`MFA setup for user: ${userId}`);
      return {
        secret: secret.base32,
        qrCode: qrCodeUrl,
        backupCodes: codes
      };
    } catch (error) {
      logger.error('Error setting up MFA:', error);
      throw error;
    }
  }

  async verify(code, token) {
    try {
      // Verify token first
      const tokenService = require('./token.service');
      const decoded = await tokenService.verify(token);
      
      if (decoded.type !== 'mfa') {
        throw new Error('Invalid token type');
      }

      const userId = decoded.sub;
      const secret = this.totpSecrets.get(userId);

      if (!secret) {
        throw new Error('MFA not set up for user');
      }

      // Verify TOTP code
      const isValid = speakeasy.totp.verify({
        secret,
        encoding: 'base32',
        token: code,
        window: 2
      });

      // Check backup codes if TOTP fails
      if (!isValid) {
        const codes = this.backupCodes.get(userId) || [];
        const codeIndex = codes.findIndex(c => c.code === code && !c.used);
        
        if (codeIndex !== -1) {
          // Mark backup code as used
          codes[codeIndex].used = true;
          this.backupCodes.set(userId, codes);
          return { verified: true, usedBackupCode: true };
        }
        
        throw new Error('Invalid MFA code');
      }

      // Generate access token
      const userService = require('./user.service');
      const user = await userService.getById(userId);
      const accessToken = await tokenService.generateAccessToken(user);
      const refreshToken = await tokenService.generateRefreshToken(userId);

      logger.info(`MFA verified for user: ${userId}`);
      return {
        verified: true,
        accessToken,
        refreshToken
      };
    } catch (error) {
      logger.error('Error verifying MFA:', error);
      throw error;
    }
  }

  generateBackupCodes() {
    const codes = [];
    for (let i = 0; i < mfaConfig.backupCodes.count; i++) {
      codes.push({
        code: this.generateBackupCode(),
        used: false
      });
    }
    return codes;
  }

  generateBackupCode() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < mfaConfig.backupCodes.length; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  }
}

module.exports = new MFAService();


