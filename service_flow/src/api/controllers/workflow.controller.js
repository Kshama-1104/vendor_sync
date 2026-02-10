const workflowEngineService = require('../services/workflow-engine.service');
const responseUtil = require('../../utils/response.util');

class WorkflowController {
  async getAll(req, res, next) {
    try {
      const { active } = req.query;
      const workflows = await workflowEngineService.getAll(active === 'true');
      res.json(responseUtil.success(workflows));
    } catch (error) {
      next(error);
    }
  }

  async getById(req, res, next) {
    try {
      const { id } = req.params;
      const workflow = await workflowEngineService.getById(id);
      if (!workflow) {
        return res.status(404).json(responseUtil.error('Workflow not found', 404));
      }
      res.json(responseUtil.success(workflow));
    } catch (error) {
      next(error);
    }
  }

  async create(req, res, next) {
    try {
      const workflowData = req.body;
      const workflow = await workflowEngineService.create(workflowData);
      res.status(201).json(responseUtil.success(workflow, 'Workflow created successfully'));
    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      const { id } = req.params;
      const workflowData = req.body;
      const workflow = await workflowEngineService.update(id, workflowData);
      res.json(responseUtil.success(workflow, 'Workflow updated successfully'));
    } catch (error) {
      next(error);
    }
  }

  async delete(req, res, next) {
    try {
      const { id } = req.params;
      await workflowEngineService.delete(id);
      res.json(responseUtil.success(null, 'Workflow deleted successfully'));
    } catch (error) {
      next(error);
    }
  }

  async execute(req, res, next) {
    try {
      const { id } = req.params;
      const { serviceId, context } = req.body;
      const result = await workflowEngineService.execute(id, serviceId, context);
      res.json(responseUtil.success(result, 'Workflow executed successfully'));
    } catch (error) {
      next(error);
    }
  }

  async getVersions(req, res, next) {
    try {
      const { id } = req.params;
      const versions = await workflowEngineService.getVersions(id);
      res.json(responseUtil.success(versions));
    } catch (error) {
      next(error);
    }
  }

  async rollback(req, res, next) {
    try {
      const { id } = req.params;
      const { version } = req.body;
      const workflow = await workflowEngineService.rollback(id, version);
      res.json(responseUtil.success(workflow, 'Workflow rolled back successfully'));
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new WorkflowController();


