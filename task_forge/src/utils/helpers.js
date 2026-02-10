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

  generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  deepClone(obj) {
    return JSON.parse(JSON.stringify(obj));
  }

  isEmpty(value) {
    return _.isEmpty(value);
  }

  formatDate(date, format = 'YYYY-MM-DD HH:mm:ss') {
    const d = new Date(date);
    return d.toLocaleString();
  }
}

module.exports = new Helpers();


