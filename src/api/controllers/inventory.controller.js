const inventorySyncService = require('../services/inventory-sync.service');
const responseUtil = require('../../utils/response.util');

class InventoryController {
  async getAll(req, res, next) {
    try {
      const { vendorId, sku, page = 1, limit = 10 } = req.query;
      const inventory = await inventorySyncService.getAll({
        vendorId,
        sku,
        page: parseInt(page),
        limit: parseInt(limit)
      });
      res.json(responseUtil.success(inventory));
    } catch (error) {
      next(error);
    }
  }

  async getByProduct(req, res, next) {
    try {
      const { productId } = req.params;
      const inventory = await inventorySyncService.getByProduct(productId);
      res.json(responseUtil.success(inventory));
    } catch (error) {
      next(error);
    }
  }

  async sync(req, res, next) {
    try {
      const { vendorId, products } = req.body;
      const result = await inventorySyncService.sync(vendorId, products);
      res.status(202).json(responseUtil.success(result, 'Inventory sync initiated'));
    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      const { id } = req.params;
      const updateData = req.body;
      const inventory = await inventorySyncService.update(id, updateData);
      res.json(responseUtil.success(inventory, 'Inventory updated successfully'));
    } catch (error) {
      next(error);
    }
  }

  async getHistory(req, res, next) {
    try {
      const { id } = req.params;
      const { startDate, endDate } = req.query;
      const history = await inventorySyncService.getHistory(id, startDate, endDate);
      res.json(responseUtil.success(history));
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new InventoryController();


