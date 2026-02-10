const jwt = require('jsonwebtoken');
const uuid = require('uuid');
const logger = require('../../core/logger');
const authConfig = require('../../../config/auth.config');
const tokenConfig = require('../../../config/token.config');
const jwtSigner = require('../../core/token-engine/jwt-signer');
const tokenValidator = require('../../core/token-engine/token-validator');
const refreshManager = require('../../core/token-engine/refresh-manager');

class TokenService {
  constructor() {
    this.blacklist = new Set();
  }

  async generateAccessToken(user) {
    try {
      const payload = {
        sub: user.id,
        email: user.email,
        roles: user.roles || [],
        permissions: user.permissions || []
      };

      const token = await jwtSigner.sign(payload, {
        expiresIn: tokenConfig.accessToken.expiresIn,
        issuer: tokenConfig.accessToken.issuer,
        audience: tokenConfig.accessToken.audience
      });

      logger.debug(`Access token generated for user: ${user.id}`);
      return token;
    } catch (error) {
      logger.error('Error generating access token:', error);
      throw error;
    }
  }

  async generateRefreshToken(userId) {
    try {
      const token = uuid.v4();
      
      // Store refresh token
      await refreshManager.store(userId, token);

      logger.debug(`Refresh token generated for user: ${userId}`);
      return token;
    } catch (error) {
      logger.error('Error generating refresh token:', error);
      throw error;
    }
  }

  async generateMFAToken(userId) {
    try {
      const payload = {
        sub: userId,
        type: 'mfa'
      };

      const token = await jwtSigner.sign(payload, {
        expiresIn: '10m',
        issuer: tokenConfig.accessToken.issuer
      });

      logger.debug(`MFA token generated for user: ${userId}`);
      return token;
    } catch (error) {
      logger.error('Error generating MFA token:', error);
      throw error;
    }
  }

  async generatePasswordResetToken(userId) {
    try {
      const payload = {
        sub: userId,
        type: 'password-reset'
      };

      const token = await jwtSigner.sign(payload, {
        expiresIn: '1h',
        issuer: tokenConfig.accessToken.issuer
      });

      logger.debug(`Password reset token generated for user: ${userId}`);
      return token;
    } catch (error) {
      logger.error('Error generating password reset token:', error);
      throw error;
    }
  }

  async verify(token) {
    try {
      // Check blacklist
      if (this.blacklist.has(token)) {
        throw new Error('Token has been revoked');
      }

      // Validate token
      const decoded = await tokenValidator.validate(token);
      return decoded;
    } catch (error) {
      logger.error('Error verifying token:', error);
      throw error;
    }
  }

  async refresh(refreshToken) {
    try {
      // Verify refresh token
      const tokenData = await refreshManager.verify(refreshToken);
      if (!tokenData) {
        throw new Error('Invalid refresh token');
      }

      // Rotate refresh token if enabled
      if (tokenConfig.refreshToken.rotationEnabled) {
        await refreshManager.revoke(refreshToken);
      }

      // Generate new tokens
      const user = { id: tokenData.userId, email: tokenData.email, roles: tokenData.roles };
      const accessToken = await this.generateAccessToken(user);
      const newRefreshToken = await this.generateRefreshToken(tokenData.userId);

      logger.info(`Tokens refreshed for user: ${tokenData.userId}`);
      return {
        accessToken,
        refreshToken: newRefreshToken
      };
    } catch (error) {
      logger.error('Error refreshing token:', error);
      throw error;
    }
  }

  async blacklist(token) {
    try {
      this.blacklist.add(token);
      
      // Clean up blacklist after TTL
      setTimeout(() => {
        this.blacklist.delete(token);
      }, tokenConfig.blacklist.ttl);

      logger.debug('Token added to blacklist');
      return true;
    } catch (error) {
      logger.error('Error blacklisting token:', error);
      throw error;
    }
  }

  async verifyPasswordResetToken(token) {
    try {
      const decoded = await tokenValidator.validate(token);
      if (decoded.type !== 'password-reset') {
        throw new Error('Invalid token type');
      }
      return decoded.sub;
    } catch (error) {
      logger.error('Error verifying password reset token:', error);
      throw error;
    }
  }

  async invalidatePasswordResetToken(token) {
    await this.blacklist(token);
  }
}

module.exports = new TokenService();


