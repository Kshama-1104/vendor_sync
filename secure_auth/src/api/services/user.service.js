const logger = require('../../core/logger');
const hash = require('../../core/crypto/hash');
const passwordValidator = require('../validators/password.validator');

class UserService {
  constructor() {
    this.users = [];
  }

  async getById(id) {
    try {
      const user = this.users.find(u => u.id === id || u.id === id.toString());
      if (!user) {
        return null;
      }

      // Don't return password
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    } catch (error) {
      logger.error(`Error getting user ${id}:`, error);
      throw error;
    }
  }

  async update(id, userData) {
    try {
      const user = this.users.find(u => u.id === id || u.id === id.toString());
      if (!user) {
        throw new Error('User not found');
      }

      Object.assign(user, userData, { updatedAt: new Date() });

      logger.info(`User updated: ${id}`);
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    } catch (error) {
      logger.error(`Error updating user ${id}:`, error);
      throw error;
    }
  }

  async changePassword(id, currentPassword, newPassword) {
    try {
      // Validate new password
      passwordValidator.validate(newPassword);

      const user = this.users.find(u => u.id === id || u.id === id.toString());
      if (!user) {
        throw new Error('User not found');
      }

      // Verify current password
      const isValid = await hash.verifyPassword(currentPassword, user.password);
      if (!isValid) {
        throw new Error('Current password is incorrect');
      }

      // Update password
      user.password = await hash.hashPassword(newPassword);
      user.updatedAt = new Date();

      logger.info(`Password changed for user: ${id}`);
      return true;
    } catch (error) {
      logger.error(`Error changing password for user ${id}:`, error);
      throw error;
    }
  }
}

module.exports = new UserService();


