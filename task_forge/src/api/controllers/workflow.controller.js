const workflowService = require('../services/workflow.service');
const responseUtil = require('../../utils/response.util');

class WorkflowController {
  async getAll(req, res, next) {
    try {
      const { workspaceId } = req.query;
      const workflows = await workflowService.getAll(workspaceId);
      res.json(responseUtil.success(workflows));
    } catch (error) {
      next(error);
    }
  }

  async getById(req, res, next) {
    try {
      const { id } = req.params;
      const workflow = await workflowService.getById(id);
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
      const workflow = await workflowService.create(workflowData);
      res.status(201).json(responseUtil.success(workflow, 'Workflow created successfully'));
    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      const { id } = req.params;
      const workflowData = req.body;
      const workflow = await workflowService.update(id, workflowData);
      res.json(responseUtil.success(workflow, 'Workflow updated successfully'));
    } catch (error) {
      next(error);
    }
  }

  async delete(req, res, next) {
    try {
      const { id } = req.params;
      await workflowService.delete(id);
      res.json(responseUtil.success(null, 'Workflow deleted successfully'));
    } catch (error) {
      next(error);
    }
  }

  async execute(req, res, next) {
    try {
      const { id } = req.params;
      const { taskId, context } = req.body;
      const result = await workflowService.execute(id, taskId, context);
      res.json(responseUtil.success(result, 'Workflow executed successfully'));
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new WorkflowController();


