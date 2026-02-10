const stateManagerService = require('../services/state-manager.service');
const responseUtil = require('../../utils/response.util');

class StateController {
  async getStates(req, res, next) {
    try {
      const { flowId } = req.params;
      const states = await stateManagerService.getStates(flowId);
      res.json(responseUtil.success(states));
    } catch (error) {
      next(error);
    }
  }

  async getById(req, res, next) {
    try {
      const { flowId, stateId } = req.params;
      const state = await stateManagerService.getById(flowId, stateId);
      if (!state) {
        return res.status(404).json(responseUtil.error('State not found', 404));
      }
      res.json(responseUtil.success(state));
    } catch (error) {
      next(error);
    }
  }

  async create(req, res, next) {
    try {
      const { flowId } = req.params;
      const stateData = req.body;
      const state = await stateManagerService.create(flowId, stateData);
      res.status(201).json(responseUtil.success(state, 'State created successfully'));
    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      const { flowId, stateId } = req.params;
      const stateData = req.body;
      const state = await stateManagerService.update(flowId, stateId, stateData);
      res.json(responseUtil.success(state, 'State updated successfully'));
    } catch (error) {
      next(error);
    }
  }

  async delete(req, res, next) {
    try {
      const { flowId, stateId } = req.params;
      await stateManagerService.delete(flowId, stateId);
      res.json(responseUtil.success(null, 'State deleted successfully'));
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new StateController();


