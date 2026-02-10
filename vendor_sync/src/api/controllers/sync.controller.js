const syncEngineService = require('../services/sync-engine.service');
const responseUtil = require('../../utils/response.util');

class SyncController {
  async getStatus(req, res, next) {
    try {
      const { vendorId, type } = req.query;
      const status = await syncEngineService.getStatus(vendorId, type);
      res.json(responseUtil.success(status));
    } catch (error) {
      next(error);
    }
  }

  async trigger(req, res, next) {
    try {
      const { vendorId, type, force } = req.body;
      const syncJob = await syncEngineService.triggerSync(vendorId, type, force);
      res.status(202).json(responseUtil.success(syncJob, 'Sync job queued successfully'));
    } catch (error) {
      next(error);
    }
  }

  async getHistory(req, res, next) {
    try {
      const { vendorId, startDate, endDate, type, page = 1, limit = 10 } = req.query;
      const history = await syncEngineService.getHistory({
        vendorId,
        startDate,
        endDate,
        type,
        page: parseInt(page),
        limit: parseInt(limit)
      });
      res.json(responseUtil.success(history));
    } catch (error) {
      next(error);
    }
  }

  async getLogs(req, res, next) {
    try {
      const { syncId } = req.params;
      const logs = await syncEngineService.getLogs(syncId);
      res.json(responseUtil.success(logs));
    } catch (error) {
      next(error);
    }
  }

  async retry(req, res, next) {
    try {
      const { syncId } = req.params;
      const syncJob = await syncEngineService.retrySync(syncId);
      res.json(responseUtil.success(syncJob, 'Sync job retried successfully'));
    } catch (error) {
      next(error);
    }
  }

  async cancel(req, res, next) {
    try {
      const { syncId } = req.params;
      await syncEngineService.cancelSync(syncId);
      res.json(responseUtil.success(null, 'Sync job cancelled successfully'));
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new SyncController();


