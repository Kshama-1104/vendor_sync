const logger = require('../../core/logger');
const helpers = require('../../utils/helpers');

class UserService {
  constructor() {
    this.users = [];
  }

  async getById(id) {
    try {
      const user = this.users.find(u => u.id === parseInt(id));
      return user || null;
    } catch (error) {
      logger.error(`Error getting user ${id}:`, error);
      throw error;
    }
  }

  async getAll(options = {}) {
    try {
      const result = helpers.paginate(this.users, options.page, options.limit);
      return result;
    } catch (error) {
      logger.error('Error getting users:', error);
      throw error;
    }
  }

  async update(id, userData) {
    try {
      const user = await this.getById(id);
      if (!user) {
        throw new Error('User not found');
      }

      Object.assign(user, userData, { updatedAt: new Date() });
      logger.info(`User updated: ${id}`);
      return user;
    } catch (error) {
      logger.error(`Error updating user ${id}:`, error);
      throw error;
    }
  }
}

module.exports = new UserService();


