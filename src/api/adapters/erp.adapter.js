const axios = require('axios');
const BaseAdapter = require('./base.adapter');
const logger = require('../../core/logger');

class ERPAdapter extends BaseAdapter {
  constructor(config) {
    super(config);
    this.client = null;
  }

  async connect() {
    try {
      this.validateConfig();

      this.client = axios.create({
        baseURL: this.config.baseUrl,
        timeout: this.config.timeout || 30000,
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`,
          'Content-Type': 'application/json'
        }
      });

      // Test connection
      await this.client.get('/health');
      this.log('Connected successfully');
      return true;
    } catch (error) {
      this.log(`Connection failed: ${error.message}`, 'error');
      throw error;
    }
  }

  async disconnect() {
    this.client = null;
    this.log('Disconnected');
  }

  async fetchInventory(vendorId) {
    try {
      const response = await this.client.get('/api/inventory', {
        params: { vendorId }
      });
      return response.data;
    } catch (error) {
      this.log(`Error fetching inventory: ${error.message}`, 'error');
      throw error;
    }
  }

  async fetchPricing(vendorId) {
    try {
      const response = await this.client.get('/api/pricing', {
        params: { vendorId }
      });
      return response.data;
    } catch (error) {
      this.log(`Error fetching pricing: ${error.message}`, 'error');
      throw error;
    }
  }

  async fetchOrders(vendorId) {
    try {
      const response = await this.client.get('/api/orders', {
        params: { vendorId }
      });
      return response.data;
    } catch (error) {
      this.log(`Error fetching orders: ${error.message}`, 'error');
      throw error;
    }
  }

  async sendOrder(order) {
    try {
      const response = await this.client.post('/api/orders', order);
      return response.data;
    } catch (error) {
      this.log(`Error sending order: ${error.message}`, 'error');
      throw error;
    }
  }
}

module.exports = ERPAdapter;


