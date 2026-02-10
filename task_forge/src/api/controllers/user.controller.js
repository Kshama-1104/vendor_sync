const userService = require('../services/user.service');
const responseUtil = require('../../utils/response.util');

class UserController {
  async getCurrentUser(req, res, next) {
    try {
      const user = await userService.getById(req.user.id);
      res.json(responseUtil.success(user));
    } catch (error) {
      next(error);
    }
  }

  async updateProfile(req, res, next) {
    try {
      const userData = req.body;
      const user = await userService.update(req.user.id, userData);
      res.json(responseUtil.success(user, 'Profile updated successfully'));
    } catch (error) {
      next(error);
    }
  }

  async getById(req, res, next) {
    try {
      const { id } = req.params;
      const user = await userService.getById(id);
      if (!user) {
        return res.status(404).json(responseUtil.error('User not found', 404));
      }
      res.json(responseUtil.success(user));
    } catch (error) {
      next(error);
    }
  }

  async getAll(req, res, next) {
    try {
      const { page = 1, limit = 10 } = req.query;
      const users = await userService.getAll({
        page: parseInt(page),
        limit: parseInt(limit)
      });
      res.json(responseUtil.success(users));
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new UserController();


