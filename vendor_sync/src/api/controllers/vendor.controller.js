const vendorService = require('../services/vendor.service');
const responseUtil = require('../../utils/response.util');

class VendorController {
  async getAll(req, res, next) {
    try {
      const { page = 1, limit = 10, status, type } = req.query;
      const result = await vendorService.getAll({
        page: parseInt(page),
        limit: parseInt(limit),
        status,
        type
      });
      res.json(responseUtil.success(result));
    } catch (error) {
      next(error);
    }
  }

  async getById(req, res, next) {
    try {
      const { id } = req.params;
      const vendor = await vendorService.getById(id);
      if (!vendor) {
        return res.status(404).json(responseUtil.error('Vendor not found', 404));
      }
      res.json(responseUtil.success(vendor));
    } catch (error) {
      next(error);
    }
  }

  async create(req, res, next) {
    try {
      const vendorData = req.body;
      const vendor = await vendorService.create(vendorData);
      res.status(201).json(responseUtil.success(vendor, 'Vendor created successfully'));
    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      const { id } = req.params;
      const vendorData = req.body;
      const vendor = await vendorService.update(id, vendorData);
      res.json(responseUtil.success(vendor, 'Vendor updated successfully'));
    } catch (error) {
      next(error);
    }
  }

  async delete(req, res, next) {
    try {
      const { id } = req.params;
      await vendorService.delete(id);
      res.json(responseUtil.success(null, 'Vendor deleted successfully'));
    } catch (error) {
      next(error);
    }
  }

  async getProducts(req, res, next) {
    try {
      const { id } = req.params;
      const { page = 1, limit = 10 } = req.query;
      const products = await vendorService.getProducts(id, {
        page: parseInt(page),
        limit: parseInt(limit)
      });
      res.json(responseUtil.success(products));
    } catch (error) {
      next(error);
    }
  }

  async getSyncStatus(req, res, next) {
    try {
      const { id } = req.params;
      const status = await vendorService.getSyncStatus(id);
      res.json(responseUtil.success(status));
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new VendorController();


