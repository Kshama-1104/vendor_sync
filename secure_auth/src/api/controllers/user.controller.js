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

  async updateCurrentUser(req, res, next) {
    try {
      const userData = req.body;
      const user = await userService.update(req.user.id, userData);
      res.json(responseUtil.success(user, 'User updated successfully'));
    } catch (error) {
      next(error);
    }
  }

  async changePassword(req, res, next) {
    try {
      const { currentPassword, newPassword } = req.body;
      await userService.changePassword(req.user.id, currentPassword, newPassword);
      res.json(responseUtil.success(null, 'Password changed successfully'));
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
}

module.exports = new UserController();


