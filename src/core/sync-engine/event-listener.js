const logger = require('../logger');
const syncEngineService = require('../../api/services/sync-engine.service');

class EventListener {
  constructor() {
    this.listeners = new Map();
  }

  start() {
    logger.info('Starting event listener...');
    // Event listener would be set up here
    // This could listen to webhooks, message queues, etc.
    this.setupWebhookListener();
    logger.info('Event listener started');
  }

  setupWebhookListener() {
    // Webhook endpoint would be registered in the app
    // This is a placeholder for the webhook handling logic
    logger.info('Webhook listener setup complete');
  }

  async handleEvent(event) {
    try {
      logger.info('Received event:', event);

      const { type, vendorId, data } = event;

      switch (type) {
        case 'inventory.update':
          await syncEngineService.triggerSync(vendorId, 'inventory', false);
          break;
        case 'pricing.update':
          await syncEngineService.triggerSync(vendorId, 'pricing', false);
          break;
        case 'order.update':
          await syncEngineService.triggerSync(vendorId, 'order', false);
          break;
        case 'catalog.update':
          await syncEngineService.triggerSync(vendorId, 'catalog', false);
          break;
        default:
          logger.warn(`Unknown event type: ${type}`);
      }
    } catch (error) {
      logger.error('Error handling event:', error);
    }
  }

  subscribe(eventType, callback) {
    if (!this.listeners.has(eventType)) {
      this.listeners.set(eventType, []);
    }
    this.listeners.get(eventType).push(callback);
  }

  emit(eventType, data) {
    if (this.listeners.has(eventType)) {
      this.listeners.get(eventType).forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          logger.error(`Error in event listener for ${eventType}:`, error);
        }
      });
    }
  }
}

module.exports = new EventListener();


