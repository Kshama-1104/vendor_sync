const logger = require('../../core/logger');

class RoleService {
  constructor() {
    this.roles = [];
  }

  async getAll() {
    return this.roles;
  }

  async getById(id) {
    return this.roles.find(r => r.id === id) || null;
  }

  async create(roleData) {
    const role = {
      id: Date.now().toString(),
      ...roleData,
      createdAt: new Date()
    };
    this.roles.push(role);
    logger.info(`Role created: ${role.id}`);
    return role;
  }

  async update(id, roleData) {
    const role = await this.getById(id);
    if (!role) throw new Error('Role not found');
    Object.assign(role, roleData, { updatedAt: new Date() });
    return role;
  }

  async delete(id) {
    const index = this.roles.findIndex(r => r.id === id);
    if (index === -1) throw new Error('Role not found');
    this.roles.splice(index, 1);
    return true;
  }
}

module.exports = new RoleService();


