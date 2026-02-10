const sessionService = require('../services/session.service');
const responseUtil = require('../../utils/response.util');

class SessionController {
  async getActiveSessions(req, res, next) {
    try {
      const sessions = await sessionService.getActiveSessions(req.user.id);
      res.json(responseUtil.success(sessions));
    } catch (error) {
      next(error);
    }
  }

  async getById(req, res, next) {
    try {
      const { id } = req.params;
      const session = await sessionService.getById(id, req.user.id);
      if (!session) {
        return res.status(404).json(responseUtil.error('Session not found', 404));
      }
      res.json(responseUtil.success(session));
    } catch (error) {
      next(error);
    }
  }

  async revoke(req, res, next) {
    try {
      const { id } = req.params;
      await sessionService.revoke(id, req.user.id);
      res.json(responseUtil.success(null, 'Session revoked successfully'));
    } catch (error) {
      next(error);
    }
  }

  async revokeAll(req, res, next) {
    try {
      await sessionService.revokeAll(req.user.id);
      res.json(responseUtil.success(null, 'All sessions revoked successfully'));
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new SessionController();


