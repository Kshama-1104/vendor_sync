const bcrypt = require('bcryptjs');
const authConfig = require('../../../config/auth.config');
const tokenManager = require('../../core/security/token-manager');
const logger = require('../../core/logger');

class AuthService {
  constructor() {
    this.users = [];
    // Add default admin user
    this.initializeDefaultUser();
  }

  async initializeDefaultUser() {
    const hashedPassword = await bcrypt.hash('admin123', authConfig.bcrypt.saltRounds);
    this.users.push({
      id: 1,
      email: 'admin@taskforge.com',
      password: hashedPassword,
      name: 'Admin User',
      role: 'admin',
      status: 'active',
      createdAt: new Date()
    });
  }

  async register(userData) {
    try {
      const { email, password, name } = userData;

      // Check if user exists
      if (this.users.find(u => u.email === email)) {
        throw new Error('User already exists');
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, authConfig.bcrypt.saltRounds);

      // Create user
      const user = {
        id: Date.now(),
        email,
        password: hashedPassword,
        name,
        role: 'user',
        status: 'active',
        createdAt: new Date()
      };

      this.users.push(user);

      // Generate tokens
      const token = tokenManager.generateAccessToken({ id: user.id, email: user.email, role: user.role });
      const refreshToken = tokenManager.generateRefreshToken({ id: user.id, email: user.email });

      logger.info(`User registered: ${user.id}`);

      return {
        token,
        refreshToken,
        user: { id: user.id, email: user.email, name: user.name, role: user.role }
      };
    } catch (error) {
      logger.error('Error registering user:', error);
      throw error;
    }
  }

  async login(email, password) {
    try {
      const user = this.users.find(u => u.email === email);
      if (!user) {
        throw new Error('Invalid credentials');
      }

      // Verify password
      const isValid = await bcrypt.compare(password, user.password);
      if (!isValid) {
        throw new Error('Invalid credentials');
      }

      // Generate tokens
      const token = tokenManager.generateAccessToken({ id: user.id, email: user.email, role: user.role });
      const refreshToken = tokenManager.generateRefreshToken({ id: user.id, email: user.email });

      logger.info(`User logged in: ${user.id}`);

      return {
        token,
        refreshToken,
        user: { id: user.id, email: user.email, name: user.name, role: user.role }
      };
    } catch (error) {
      logger.error('Error logging in:', error);
      throw error;
    }
  }

  async refreshToken(refreshToken) {
    try {
      const decoded = tokenManager.verifyRefreshToken(refreshToken);
      const user = this.users.find(u => u.id === decoded.id);
      
      if (!user) {
        throw new Error('User not found');
      }

      const token = tokenManager.generateAccessToken({ id: user.id, email: user.email, role: user.role });
      const newRefreshToken = tokenManager.generateRefreshToken({ id: user.id, email: user.email });

      return {
        token,
        refreshToken: newRefreshToken
      };
    } catch (error) {
      logger.error('Error refreshing token:', error);
      throw error;
    }
  }

  async getGoogleAuthUrl() {
    // Implementation would generate Google OAuth URL
    return 'https://accounts.google.com/o/oauth2/auth?...';
  }

  async handleGoogleCallback(code) {
    // Implementation would exchange code for token and create/login user
    const token = tokenManager.generateAccessToken({ id: 1, email: 'user@example.com', role: 'user' });
    return { token };
  }

  async getGithubAuthUrl() {
    // Implementation would generate GitHub OAuth URL
    return 'https://github.com/login/oauth/authorize?...';
  }

  async handleGithubCallback(code) {
    // Implementation would exchange code for token and create/login user
    const token = tokenManager.generateAccessToken({ id: 1, email: 'user@example.com', role: 'user' });
    return { token };
  }
}

module.exports = new AuthService();


