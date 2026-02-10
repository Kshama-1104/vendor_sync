const authService = require('../services/auth.service');
const tokenService = require('../services/token.service');
const mfaService = require('../services/mfa.service');
const oauthService = require('../services/oauth.service');
const responseUtil = require('../../utils/response.util');
const loginEvents = require('../events/login.events');

class AuthController {
  async register(req, res, next) {
    try {
      const userData = req.body;
      const user = await authService.register(userData);
      res.status(201).json(responseUtil.success(user, 'User registered successfully'));
    } catch (error) {
      next(error);
    }
  }

  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const result = await authService.login(email, password, req.ip, req.headers['user-agent']);

      loginEvents.emit('login.success', {
        userId: result.user.id,
        ip: req.ip,
        userAgent: req.headers['user-agent']
      });

      res.json(responseUtil.success(result, 'Login successful'));
    } catch (error) {
      loginEvents.emit('login.failure', {
        email,
        ip: req.ip,
        userAgent: req.headers['user-agent'],
        error: error.message
      });
      next(error);
    }
  }

  async logout(req, res, next) {
    try {
      const token = req.headers.authorization?.substring(7);
      await authService.logout(token);
      res.json(responseUtil.success(null, 'Logout successful'));
    } catch (error) {
      next(error);
    }
  }

  async refresh(req, res, next) {
    try {
      const { refreshToken } = req.body;
      const tokens = await tokenService.refresh(refreshToken);
      res.json(responseUtil.success(tokens, 'Token refreshed successfully'));
    } catch (error) {
      next(error);
    }
  }

  async passwordResetRequest(req, res, next) {
    try {
      const { email } = req.body;
      await authService.requestPasswordReset(email);
      res.json(responseUtil.success(null, 'Password reset email sent'));
    } catch (error) {
      next(error);
    }
  }

  async passwordResetConfirm(req, res, next) {
    try {
      const { token, newPassword } = req.body;
      await authService.confirmPasswordReset(token, newPassword);
      res.json(responseUtil.success(null, 'Password reset successful'));
    } catch (error) {
      next(error);
    }
  }

  async mfaSetup(req, res, next) {
    try {
      const userId = req.user?.id;
      const setup = await mfaService.setup(userId);
      res.json(responseUtil.success(setup, 'MFA setup initiated'));
    } catch (error) {
      next(error);
    }
  }

  async mfaVerify(req, res, next) {
    try {
      const { code, token } = req.body;
      const result = await mfaService.verify(code, token);
      res.json(responseUtil.success(result, 'MFA verification successful'));
    } catch (error) {
      next(error);
    }
  }

  async oauthInitiate(req, res, next) {
    try {
      const { provider } = req.params;
      const redirectUrl = await oauthService.initiate(provider, req.query.redirect_uri);
      res.redirect(redirectUrl);
    } catch (error) {
      next(error);
    }
  }

  async oauthCallback(req, res, next) {
    try {
      const { provider } = req.params;
      const { code, state } = req.query;
      const result = await oauthService.callback(provider, code, state);
      res.json(responseUtil.success(result, 'OAuth authentication successful'));
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AuthController();


