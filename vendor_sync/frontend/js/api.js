const API_BASE_URL = 'http://localhost:3000/api/v1';

class ApiClient {
  constructor() {
    this.baseUrl = API_BASE_URL;
    this.token = localStorage.getItem('auth_token');
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    const config = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(this.token && { Authorization: `Bearer ${this.token}` }),
        ...options.headers
      }
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error?.message || 'Request failed');
      }
      
      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  async get(endpoint) {
    return this.request(endpoint, { method: 'GET' });
  }

  async post(endpoint, data) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }
}

const api = new ApiClient();

// API methods
const vendorApi = {
  getAll: () => api.get('/vendors'),
  getById: (id) => api.get(`/vendors/${id}`)
};

const syncApi = {
  getStatus: (vendorId, type) => api.get(`/sync/status?vendorId=${vendorId}&type=${type}`),
  trigger: (vendorId, type) => api.post('/sync/trigger', { vendorId, type }),
  getHistory: () => api.get('/sync/history')
};

const analyticsApi = {
  getDashboard: (vendorId, period) => api.get(`/analytics/dashboard?vendorId=${vendorId}&period=${period}`)
};


