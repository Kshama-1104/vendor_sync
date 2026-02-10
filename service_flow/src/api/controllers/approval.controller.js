const approvalEngineService = require('../services/approval-engine.service');
const responseUtil = require('../../utils/response.util');

class ApprovalController {
  async getPending(req, res, next) {
    try {
      const { userId } = req.query;
      const approvals = await approvalEngineService.getPending(userId || req.user.id);
      res.json(responseUtil.success(approvals));
    } catch (error) {
      next(error);
    }
  }

  async getById(req, res, next) {
    try {
      const { id } = req.params;
      const approval = await approvalEngineService.getById(id);
      if (!approval) {
        return res.status(404).json(responseUtil.error('Approval not found', 404));
      }
      res.json(responseUtil.success(approval));
    } catch (error) {
      next(error);
    }
  }

  async approve(req, res, next) {
    try {
      const { id } = req.params;
      const { comment } = req.body;
      const approval = await approvalEngineService.approve(id, req.user.id, comment);
      res.json(responseUtil.success(approval, 'Request approved successfully'));
    } catch (error) {
      next(error);
    }
  }

  async reject(req, res, next) {
    try {
      const { id } = req.params;
      const { comment, reason } = req.body;
      const approval = await approvalEngineService.reject(id, req.user.id, comment, reason);
      res.json(responseUtil.success(approval, 'Request rejected'));
    } catch (error) {
      next(error);
    }
  }

  async getHistory(req, res, next) {
    try {
      const { id } = req.params;
      const history = await approvalEngineService.getHistory(id);
      res.json(responseUtil.success(history));
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new ApprovalController();


