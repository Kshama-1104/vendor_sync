const _ = require('lodash');

class Helpers {
  paginate(data, page, limit) {
    const offset = (page - 1) * limit;
    const paginatedData = data.slice(offset, offset + limit);
    
    return {
      data: paginatedData,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: data.length,
        totalPages: Math.ceil(data.length / limit),
        hasNext: offset + limit < data.length,
        hasPrev: page > 1
      }
    };
  }

  sanitizeObject(obj, allowedFields) {
    return _.pick(obj, allowedFields);
  }

  generateOrderNumber(prefix = 'ORD') {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `${prefix}-${timestamp}-${random}`;
  }

  generateSyncId(vendorId, syncType) {
    const timestamp = Date.now();
    return `sync-${vendorId}-${syncType}-${timestamp}`;
  }

  normalizeData(data, schema) {
    const normalized = {};
    
    for (const [key, value] of Object.entries(schema)) {
      if (data.hasOwnProperty(key)) {
        normalized[value] = data[key];
      }
    }
    
    return normalized;
  }

  calculatePercentage(part, total) {
    if (total === 0) return 0;
    return Math.round((part / total) * 100);
  }

  formatCurrency(amount, currency = 'USD') {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(amount);
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  chunkArray(array, size) {
    return _.chunk(array, size);
  }

  deepMerge(target, source) {
    return _.merge(target, source);
  }

  isEmpty(value) {
    return _.isEmpty(value);
  }
}

module.exports = new Helpers();


