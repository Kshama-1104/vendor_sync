module.exports = {
  VENDOR_TYPES: {
    SUPPLIER: 'supplier',
    SERVICE_PROVIDER: 'service_provider',
    PARTNER: 'partner'
  },

  VENDOR_STATUS: {
    PENDING: 'pending',
    ACTIVE: 'active',
    INACTIVE: 'inactive',
    SUSPENDED: 'suspended'
  },

  INTEGRATION_TYPES: {
    API: 'api',
    FTP: 'ftp',
    WEBHOOK: 'webhook',
    FILE: 'file'
  },

  SYNC_TYPES: {
    INVENTORY: 'inventory',
    PRICING: 'pricing',
    ORDER: 'order',
    CATALOG: 'catalog',
    ALL: 'all'
  },

  SYNC_STATUS: {
    PENDING: 'pending',
    RUNNING: 'running',
    COMPLETED: 'completed',
    FAILED: 'failed',
    CANCELLED: 'cancelled'
  },

  ORDER_STATUS: {
    PENDING: 'pending',
    CONFIRMED: 'confirmed',
    SHIPPED: 'shipped',
    DELIVERED: 'delivered',
    CANCELLED: 'cancelled'
  },

  ROLES: {
    ADMIN: 'admin',
    VENDOR: 'vendor',
    USER: 'user',
    OPERATOR: 'operator'
  },

  HTTP_STATUS: {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    INTERNAL_ERROR: 500
  },

  FILE_TYPES: {
    CSV: 'csv',
    XML: 'xml',
    JSON: 'json',
    XLSX: 'xlsx'
  }
};


