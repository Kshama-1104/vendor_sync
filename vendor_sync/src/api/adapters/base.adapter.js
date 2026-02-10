const logger = require('../../core/logger');

class BaseAdapter {
  constructor(config) {
    this.config = config;
    this.name = this.constructor.name;
  }

  async connect() {
    throw new Error('connect() must be implemented by subclass');
  }

  async disconnect() {
    throw new Error('disconnect() must be implemented by subclass');
  }

  async fetchInventory(vendorId) {
    throw new Error('fetchInventory() must be implemented by subclass');
  }

  async fetchPricing(vendorId) {
    throw new Error('fetchPricing() must be implemented by subclass');
  }

  async fetchOrders(vendorId) {
    throw new Error('fetchOrders() must be implemented by subclass');
  }

  async sendOrder(order) {
    throw new Error('sendOrder() must be implemented by subclass');
  }

  validateConfig() {
    if (!this.config) {
      throw new Error('Adapter config is required');
    }
    return true;
  }

  log(message, level = 'info') {
    logger[level](`[${this.name}] ${message}`);
  }
}

module.exports = BaseAdapter;


