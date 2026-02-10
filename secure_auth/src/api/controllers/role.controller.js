const roleService = require('../services/role.service');
const responseUtil = require('../../utils/response.util');

class RoleController {
  async getAll(req, res, next) {
    try {
      const roles = await roleService.getAll();
      res.json(responseUtil.success(roles));
    } catch (error) {
      next(error);
    }
  }

  async getById(req, res, next) {
    try {
      const { id } = req.params;
      const role = await roleService.getById(id);
      if (!role) {
        return res.status(404).json(responseUtil.error('Role not found', 404));
      }
      res.json(responseUtil.success(role));
    } catch (error) {
      next(error);
    }
  }

  async create(req, res, next) {
    try {
      const roleData = req.body;
      const role = await roleService.create(roleData);
      res.status(201).json(responseUtil.success(role, 'Role created successfully'));
    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      const { id } = req.params;
      const roleData = req.body;
      const role = await roleService.update(id, roleData);
      res.json(responseUtil.success(role, 'Role updated successfully'));
    } catch (error) {
      next(error);
    }
  }

  async delete(req, res, next) {
    try {
      const { id } = req.params;
      await roleService.delete(id);
      res.json(responseUtil.success(null, 'Role deleted successfully'));
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new RoleController();


