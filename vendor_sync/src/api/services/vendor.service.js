const logger = require('../../core/logger');
const helpers = require('../../utils/helpers');
const constants = require('../../utils/constants');

class VendorService {
  constructor() {
    // In a real implementation, this would use a database model
    this.vendors = [];
  }

  async getAll(options = {}) {
    try {
      let vendors = [...this.vendors];

      // Filter by status
      if (options.status) {
        vendors = vendors.filter(v => v.status === options.status);
      }

      // Filter by type
      if (options.type) {
        vendors = vendors.filter(v => v.type === options.type);
      }

      // Paginate
      const result = helpers.paginate(vendors, options.page, options.limit);
      return result;
    } catch (error) {
      logger.error('Error getting vendors:', error);
      throw error;
    }
  }

  async getById(id) {
    try {
      const vendor = this.vendors.find(v => v.id === parseInt(id));
      return vendor || null;
    } catch (error) {
      logger.error(`Error getting vendor ${id}:`, error);
      throw error;
    }
  }

  async create(vendorData) {
    try {
      const vendor = {
        id: Date.now(),
        ...vendorData,
        status: constants.VENDOR_STATUS.PENDING,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      this.vendors.push(vendor);
      logger.info(`Vendor created: ${vendor.id}`);
      return vendor;
    } catch (error) {
      logger.error('Error creating vendor:', error);
      throw error;
    }
  }

  async update(id, vendorData) {
    try {
      const vendor = await this.getById(id);
      if (!vendor) {
        throw new Error('Vendor not found');
      }

      Object.assign(vendor, vendorData, { updatedAt: new Date() });
      logger.info(`Vendor updated: ${id}`);
      return vendor;
    } catch (error) {
      logger.error(`Error updating vendor ${id}:`, error);
      throw error;
    }
  }

  async delete(id) {
    try {
      const index = this.vendors.findIndex(v => v.id === parseInt(id));
      if (index === -1) {
        throw new Error('Vendor not found');
      }

      this.vendors.splice(index, 1);
      logger.info(`Vendor deleted: ${id}`);
      return true;
    } catch (error) {
      logger.error(`Error deleting vendor ${id}:`, error);
      throw error;
    }
  }

  async getProducts(vendorId, options = {}) {
    // This would fetch products from the database
    return { data: [], pagination: { page: 1, limit: 10, total: 0 } };
  }

  async getSyncStatus(vendorId) {
    // This would fetch sync status from the database
    return {
      vendorId,
      lastSync: null,
      status: 'pending',
      nextSync: null
    };
  }

  async getActiveVendors() {
    return this.vendors.filter(v => v.status === constants.VENDOR_STATUS.ACTIVE);
  }
}

module.exports = new VendorService();


