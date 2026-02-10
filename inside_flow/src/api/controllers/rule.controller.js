const ruleEngineService = require('../services/rule-engine.service');
const responseUtil = require('../../utils/response.util');

class RuleController {
  async getRules(req, res, next) {
    try {
      const { flowId } = req.params;
      const rules = await ruleEngineService.getRules(flowId);
      res.json(responseUtil.success(rules));
    } catch (error) {
      next(error);
    }
  }

  async getById(req, res, next) {
    try {
      const { flowId, ruleId } = req.params;
      const rule = await ruleEngineService.getById(flowId, ruleId);
      if (!rule) {
        return res.status(404).json(responseUtil.error('Rule not found', 404));
      }
      res.json(responseUtil.success(rule));
    } catch (error) {
      next(error);
    }
  }

  async create(req, res, next) {
    try {
      const { flowId } = req.params;
      const ruleData = req.body;
      const rule = await ruleEngineService.create(flowId, ruleData);
      res.status(201).json(responseUtil.success(rule, 'Rule created successfully'));
    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      const { flowId, ruleId } = req.params;
      const ruleData = req.body;
      const rule = await ruleEngineService.update(flowId, ruleId, ruleData);
      res.json(responseUtil.success(rule, 'Rule updated successfully'));
    } catch (error) {
      next(error);
    }
  }

  async delete(req, res, next) {
    try {
      const { flowId, ruleId } = req.params;
      await ruleEngineService.delete(flowId, ruleId);
      res.json(responseUtil.success(null, 'Rule deleted successfully'));
    } catch (error) {
      next(error);
    }
  }

  async evaluate(req, res, next) {
    try {
      const { flowId, ruleId } = req.params;
      const { context } = req.body;
      const result = await ruleEngineService.evaluate(flowId, ruleId, context);
      res.json(responseUtil.success(result));
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new RuleController();


