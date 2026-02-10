const logger = require('../../core/logger');
const oauthConfig = require('../../../config/oauth.config');
const authService = require('./auth.service');
const tokenService = require('./token.service');

class OAuthService {
  async initiate(provider, redirectUri) {
    try {
      const providerConfig = oauthConfig.providers[provider];
      if (!providerConfig || !providerConfig.enabled) {
        throw new Error(`OAuth provider ${provider} not enabled`);
      }

      // Generate state
      const state = this.generateState();

      // Build authorization URL
      const params = new URLSearchParams({
        client_id: providerConfig.clientId,
        redirect_uri: redirectUri || providerConfig.callbackURL,
        response_type: 'code',
        scope: providerConfig.scope.join(' '),
        state
      });

      const baseUrl = this.getProviderAuthUrl(provider);
      const authUrl = `${baseUrl}?${params.toString()}`;

      logger.info(`OAuth initiated for provider: ${provider}`);
      return authUrl;
    } catch (error) {
      logger.error(`Error initiating OAuth for ${provider}:`, error);
      throw error;
    }
  }

  async callback(provider, code, state) {
    try {
      // Verify state
      if (!this.verifyState(state)) {
        throw new Error('Invalid state parameter');
      }

      const providerConfig = oauthConfig.providers[provider];
      if (!providerConfig || !providerConfig.enabled) {
        throw new Error(`OAuth provider ${provider} not enabled`);
      }

      // Exchange code for tokens
      const tokens = await this.exchangeCode(provider, code, providerConfig);

      // Get user info
      const userInfo = await this.getUserInfo(provider, tokens.access_token);

      // Find or create user
      let user = await this.findOrCreateUser(provider, userInfo);

      // Generate application tokens
      const accessToken = await tokenService.generateAccessToken(user);
      const refreshToken = await tokenService.generateRefreshToken(user.id);

      logger.info(`OAuth callback successful for provider: ${provider}`);
      return {
        user: {
          id: user.id,
          email: user.email,
          name: user.name
        },
        accessToken,
        refreshToken
      };
    } catch (error) {
      logger.error(`Error in OAuth callback for ${provider}:`, error);
      throw error;
    }
  }

  async exchangeCode(provider, code, config) {
    // In production, make actual OAuth token exchange request
    return {
      access_token: 'mock-access-token',
      refresh_token: 'mock-refresh-token'
    };
  }

  async getUserInfo(provider, accessToken) {
    // In production, fetch user info from provider
    return {
      id: 'provider-user-id',
      email: 'user@example.com',
      name: 'User Name'
    };
  }

  async findOrCreateUser(provider, userInfo) {
    const authService = require('./auth.service');
    // In production, find or create user based on provider and userInfo
    return {
      id: Date.now().toString(),
      email: userInfo.email,
      name: userInfo.name,
      roles: ['user']
    };
  }

  getProviderAuthUrl(provider) {
    const urls = {
      google: 'https://accounts.google.com/o/oauth2/v2/auth',
      github: 'https://github.com/login/oauth/authorize',
      microsoft: 'https://login.microsoftonline.com/common/oauth2/v2.0/authorize'
    };
    return urls[provider] || '';
  }

  generateState() {
    const crypto = require('crypto');
    return crypto.randomBytes(32).toString('hex');
  }

  verifyState(state) {
    // In production, verify state against stored state
    return true;
  }
}

module.exports = new OAuthService();


