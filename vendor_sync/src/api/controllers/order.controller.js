const orderSyncService = require('../services/order-sync.service');
const responseUtil = require('../../utils/response.util');

class OrderController {
  async getAll(req, res, next) {
    try {
      const { vendorId, status, page = 1, limit = 10 } = req.query;
      const orders = await orderSyncService.getAll({
        vendorId,
        status,
        page: parseInt(page),
        limit: parseInt(limit)
      });
      res.json(responseUtil.success(orders));
    } catch (error) {
      next(error);
    }
  }

  async getById(req, res, next) {
    try {
      const { id } = req.params;
      const order = await orderSyncService.getById(id);
      if (!order) {
        return res.status(404).json(responseUtil.error('Order not found', 404));
      }
      res.json(responseUtil.success(order));
    } catch (error) {
      next(error);
    }
  }

  async create(req, res, next) {
    try {
      const orderData = req.body;
      const order = await orderSyncService.create(orderData);
      res.status(201).json(responseUtil.success(order, 'Order created successfully'));
    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      const { id } = req.params;
      const updateData = req.body;
      const order = await orderSyncService.update(id, updateData);
      res.json(responseUtil.success(order, 'Order updated successfully'));
    } catch (error) {
      next(error);
    }
  }

  async updateStatus(req, res, next) {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const order = await orderSyncService.updateStatus(id, status);
      res.json(responseUtil.success(order, 'Order status updated successfully'));
    } catch (error) {
      next(error);
    }
  }

  async sync(req, res, next) {
    try {
      const { vendorId, orders } = req.body;
      const result = await orderSyncService.sync(vendorId, orders);
      res.status(202).json(responseUtil.success(result, 'Order sync initiated'));
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new OrderController();


