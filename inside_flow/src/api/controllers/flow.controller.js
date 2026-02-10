const flowEngineService = require('../services/flow-engine.service');
const responseUtil = require('../../utils/response.util');

class FlowController {
  async getAll(req, res, next) {
    try {
      const { status, version, page = 1, limit = 10 } = req.query;
      const flows = await flowEngineService.getAll({
        status,
        version,
        page: parseInt(page),
        limit: parseInt(limit)
      });
      res.json(responseUtil.success(flows));
    } catch (error) {
      next(error);
    }
  }

  async getById(req, res, next) {
    try {
      const { id } = req.params;
      const flow = await flowEngineService.getById(id);
      if (!flow) {
        return res.status(404).json(responseUtil.error('Flow not found', 404));
      }
      res.json(responseUtil.success(flow));
    } catch (error) {
      next(error);
    }
  }

  async create(req, res, next) {
    try {
      const flowData = req.body;
      const flow = await flowEngineService.create(flowData);
      res.status(201).json(responseUtil.success(flow, 'Flow created successfully'));
    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      const { id } = req.params;
      const flowData = req.body;
      const flow = await flowEngineService.update(id, flowData);
      res.json(responseUtil.success(flow, 'Flow updated successfully'));
    } catch (error) {
      next(error);
    }
  }

  async delete(req, res, next) {
    try {
      const { id } = req.params;
      await flowEngineService.delete(id);
      res.json(responseUtil.success(null, 'Flow deleted successfully'));
    } catch (error) {
      next(error);
    }
  }

  async execute(req, res, next) {
    try {
      const { id } = req.params;
      const { input, context } = req.body;
      const execution = await flowEngineService.execute(id, { input, context });
      res.status(201).json(responseUtil.success(execution, 'Flow execution started'));
    } catch (error) {
      next(error);
    }
  }

  async getExecutions(req, res, next) {
    try {
      const { id } = req.params;
      const { startDate, endDate, page = 1, limit = 10 } = req.query;
      const executions = await flowEngineService.getExecutions(id, {
        startDate,
        endDate,
        page: parseInt(page),
        limit: parseInt(limit)
      });
      res.json(responseUtil.success(executions));
    } catch (error) {
      next(error);
    }
  }

  async getVersions(req, res, next) {
    try {
      const { id } = req.params;
      const versions = await flowEngineService.getVersions(id);
      res.json(responseUtil.success(versions));
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new FlowController();


