const axios = require('axios');
const BaseAdapter = require('./base.adapter');

class CRMAdapter extends BaseAdapter {
  constructor(config) {
    super(config);
    this.client = null;
  }

  async connect() {
    this.validateConfig();
    this.client = axios.create({
      baseURL: this.config.baseUrl,
      timeout: this.config.timeout || 30000,
      headers: {
        'Authorization': `Bearer ${this.config.apiKey}`,
        'Content-Type': 'application/json'
      }
    });
    this.log('Connected successfully');
    return true;
  }

  async disconnect() {
    this.client = null;
    this.log('Disconnected');
  }

  async fetchInventory(vendorId) {
    const response = await this.client.get('/api/contacts', {
      params: { vendorId }
    });
    return response.data;
  }

  async fetchPricing(vendorId) {
    const response = await this.client.get('/api/accounts', {
      params: { vendorId }
    });
    return response.data;
  }

  async fetchOrders(vendorId) {
    const response = await this.client.get('/api/opportunities', {
      params: { vendorId }
    });
    return response.data;
  }

  async sendOrder(order) {
    const response = await this.client.post('/api/opportunities', order);
    return response.data;
  }
}

module.exports = CRMAdapter;


