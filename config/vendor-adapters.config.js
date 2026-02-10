require('dotenv').config();

module.exports = {
  adapters: {
    erp: {
      enabled: process.env.ERP_ADAPTER_ENABLED === 'true',
      timeout: 30000,
      retryAttempts: 3,
      supportedFormats: ['json', 'xml'],
      endpoints: {
        inventory: '/api/inventory',
        pricing: '/api/pricing',
        orders: '/api/orders',
        products: '/api/products'
      }
    },
    crm: {
      enabled: process.env.CRM_ADAPTER_ENABLED === 'true',
      timeout: 30000,
      retryAttempts: 3,
      supportedFormats: ['json'],
      endpoints: {
        contacts: '/api/contacts',
        accounts: '/api/accounts',
        opportunities: '/api/opportunities'
      }
    },
    ftp: {
      enabled: process.env.FTP_ADAPTER_ENABLED === 'true',
      timeout: 60000,
      retryAttempts: 5,
      supportedFormats: ['csv', 'xml', 'json', 'xlsx'],
      directories: {
        inbound: '/inbound',
        outbound: '/outbound',
        archive: '/archive'
      },
      pollingInterval: 300000 // 5 minutes
    },
    webhook: {
      enabled: process.env.WEBHOOK_ADAPTER_ENABLED === 'true',
      timeout: 10000,
      retryAttempts: 3,
      supportedFormats: ['json'],
      signatureValidation: true,
      allowedMethods: ['POST', 'PUT']
    }
  },
  defaultAdapter: 'api',
  fallbackAdapter: 'ftp'
};


