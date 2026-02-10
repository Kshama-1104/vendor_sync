const logger = require('../../core/logger');
const hash = require('../../core/crypto/hash');
const tokenService = require('./token.service');
const sessionService = require('./session.service');
const passwordValidator = require('../validators/password.validator');
const bruteForceProtector = require('../../core/security/brute-force-protector');

class AuthService {
  constructor() {
    this.users = [];
  }

  async register(userData) {
    try {
      // Validate password
      passwordValidator.validate(userData.password);

      // Check if user exists
      const existingUser = this.users.find(u => u.email === userData.email);
      if (existingUser) {
        throw new Error('User already exists');
      }

      // Hash password
      const hashedPassword = await hash.hashPassword(userData.password);

      // Create user
      const user = {
        id: Date.now().toString(),
        email: userData.email,
        name: userData.name,
        password: hashedPassword,
        roles: ['user'],
        mfaEnabled: false,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      this.users.push(user);

      logger.info(`User registered: ${user.id}`);
      return {
        id: user.id,
        email: user.email,
        name: user.name
      };
    } catch (error) {
      logger.error('Error registering user:', error);
      throw error;
    }
  }

  async login(email, password, ip, userAgent) {
    try {
      // Check brute force protection
      await bruteForceProtector.check(email, ip);

      // Find user
      const user = this.users.find(u => u.email === email);
      if (!user) {
        throw new Error('Invalid credentials');
      }

      // Verify password
      const isValid = await hash.verifyPassword(password, user.password);
      if (!isValid) {
        await bruteForceProtector.recordFailure(email, ip);
        throw new Error('Invalid credentials');
      }

      // Check if MFA is required
      if (user.mfaEnabled) {
        // Return MFA token instead of access token
        const mfaToken = await tokenService.generateMFAToken(user.id);
        return {
          mfaRequired: true,
          mfaToken
        };
      }

      // Generate tokens
      const accessToken = await tokenService.generateAccessToken(user);
      const refreshToken = await tokenService.generateRefreshToken(user.id);

      // Create session
      const session = await sessionService.create({
        userId: user.id,
        ip,
        userAgent,
        accessToken
      });

      // Record successful login
      await bruteForceProtector.recordSuccess(email, ip);

      logger.info(`User logged in: ${user.id}`);
      return {
        user: {
          id: user.id,
          email: user.email,
          name: user.name
        },
        accessToken,
        refreshToken,
        sessionId: session.id
      };
    } catch (error) {
      logger.error('Error logging in:', error);
      throw error;
    }
  }

  async logout(token) {
    try {
      // Add token to blacklist
      await tokenService.blacklist(token);

      // Invalidate session
      await sessionService.invalidateByToken(token);

      logger.info('User logged out');
      return true;
    } catch (error) {
      logger.error('Error logging out:', error);
      throw error;
    }
  }

  async requestPasswordReset(email) {
    try {
      const user = this.users.find(u => u.email === email);
      if (!user) {
        // Don't reveal if user exists
        return;
      }

      // Generate reset token
      const resetToken = await tokenService.generatePasswordResetToken(user.id);

      // In production, send email with reset link
      logger.info(`Password reset requested for: ${email}`);
      return true;
    } catch (error) {
      logger.error('Error requesting password reset:', error);
      throw error;
    }
  }

  async confirmPasswordReset(token, newPassword) {
    try {
      // Validate password
      passwordValidator.validate(newPassword);

      // Verify reset token
      const userId = await tokenService.verifyPasswordResetToken(token);
      if (!userId) {
        throw new Error('Invalid or expired reset token');
      }

      // Find user
      const user = this.users.find(u => u.id === userId);
      if (!user) {
        throw new Error('User not found');
      }

      // Update password
      user.password = await hash.hashPassword(newPassword);
      user.updatedAt = new Date();

      // Invalidate reset token
      await tokenService.invalidatePasswordResetToken(token);

      logger.info(`Password reset for user: ${userId}`);
      return true;
    } catch (error) {
      logger.error('Error confirming password reset:', error);
      throw error;
    }
  }
}

module.exports = new AuthService();


