const authService = require('../services/auth.service');
const responseUtil = require('../../utils/response.util');

class AuthController {
  async register(req, res, next) {
    try {
      const userData = req.body;
      const result = await authService.register(userData);
      res.status(201).json(responseUtil.success(result, 'User registered successfully'));
    } catch (error) {
      next(error);
    }
  }

  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const result = await authService.login(email, password);
      res.json(responseUtil.success(result, 'Login successful'));
    } catch (error) {
      next(error);
    }
  }

  async refreshToken(req, res, next) {
    try {
      const { refreshToken } = req.body;
      const result = await authService.refreshToken(refreshToken);
      res.json(responseUtil.success(result, 'Token refreshed successfully'));
    } catch (error) {
      next(error);
    }
  }

  async googleAuth(req, res, next) {
    try {
      const url = await authService.getGoogleAuthUrl();
      res.redirect(url);
    } catch (error) {
      next(error);
    }
  }

  async googleCallback(req, res, next) {
    try {
      const { code } = req.query;
      const result = await authService.handleGoogleCallback(code);
      // Redirect to frontend with token
      res.redirect(`${process.env.FRONTEND_URL}/auth/callback?token=${result.token}`);
    } catch (error) {
      next(error);
    }
  }

  async githubAuth(req, res, next) {
    try {
      const url = await authService.getGithubAuthUrl();
      res.redirect(url);
    } catch (error) {
      next(error);
    }
  }

  async githubCallback(req, res, next) {
    try {
      const { code } = req.query;
      const result = await authService.handleGithubCallback(code);
      res.redirect(`${process.env.FRONTEND_URL}/auth/callback?token=${result.token}`);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AuthController();


