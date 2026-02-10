const logger = require('../../core/logger');
const helpers = require('../../utils/helpers');
const constants = require('../../utils/constants');
const workflowEngineService = require('./workflow-engine.service');
const serviceEvents = require('../events/service.events');

class ServiceLifecycleService {
  constructor() {
    this.services = [];
  }

  async getAll(options = {}) {
    try {
      let services = [...this.services];

      // Filter by status
      if (options.status) {
        services = services.filter(s => s.status === options.status);
      }

      // Filter by priority
      if (options.priority) {
        services = services.filter(s => s.priority === options.priority);
      }

      // Filter by service type
      if (options.serviceType) {
        services = services.filter(s => s.serviceType === options.serviceType);
      }

      // Apply permission-based filtering
      services = this.filterByPermissions(services, options.userId);

      const result = helpers.paginate(services, options.page, options.limit);
      return result;
    } catch (error) {
      logger.error('Error getting services:', error);
      throw error;
    }
  }

  filterByPermissions(services, userId) {
    // In a real implementation, this would check user permissions
    return services;
  }

  async getById(id, userId) {
    try {
      const service = this.services.find(s => s.id === parseInt(id));
      if (!service) {
        return null;
      }

      // Check permissions
      if (!this.canAccessService(service, userId)) {
        throw new Error('Access denied');
      }

      return service;
    } catch (error) {
      logger.error(`Error getting service ${id}:`, error);
      throw error;
    }
  }

  canAccessService(service, userId) {
    return true; // Simplified for now
  }

  async create(serviceData) {
    try {
      const service = {
        id: Date.now(),
        ...serviceData,
        status: constants.SERVICE_STATUS.SUBMITTED,
        priority: serviceData.priority || constants.SERVICE_PRIORITY.MEDIUM,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      this.services.push(service);

      // Start workflow if workflowId provided
      if (serviceData.workflowId) {
        await workflowEngineService.execute(serviceData.workflowId, service.id, {
          service,
          event: 'service.created'
        });
      }

      // Emit event
      serviceEvents.emit('service.created', service);

      logger.info(`Service created: ${service.id}`);
      return service;
    } catch (error) {
      logger.error('Error creating service:', error);
      throw error;
    }
  }

  async update(id, serviceData, userId) {
    try {
      const service = await this.getById(id, userId);
      if (!service) {
        throw new Error('Service not found');
      }

      const oldValues = { ...service };
      Object.assign(service, serviceData, { updatedAt: new Date() });

      // Emit event
      serviceEvents.emit('service.updated', service, serviceData);

      logger.info(`Service updated: ${id}`);
      return service;
    } catch (error) {
      logger.error(`Error updating service ${id}:`, error);
      throw error;
    }
  }

  async updateStatus(id, status, userId) {
    try {
      const service = await this.getById(id, userId);
      if (!service) {
        throw new Error('Service not found');
      }

      const oldStatus = service.status;
      service.status = status;
      service.updatedAt = new Date();

      // Emit event
      serviceEvents.emit('service.status.changed', service, oldStatus, status);

      logger.info(`Service status updated: ${id} from ${oldStatus} to ${status}`);
      return service;
    } catch (error) {
      logger.error(`Error updating service status ${id}:`, error);
      throw error;
    }
  }

  async cancel(id, userId) {
    try {
      const service = await this.getById(id, userId);
      if (!service) {
        throw new Error('Service not found');
      }

      service.status = constants.SERVICE_STATUS.CANCELLED;
      service.updatedAt = new Date();

      // Emit event
      serviceEvents.emit('service.cancelled', service);

      logger.info(`Service cancelled: ${id}`);
      return service;
    } catch (error) {
      logger.error(`Error cancelling service ${id}:`, error);
      throw error;
    }
  }

  async pause(id, userId) {
    try {
      const service = await this.getById(id, userId);
      if (!service) {
        throw new Error('Service not found');
      }

      service.status = constants.SERVICE_STATUS.PAUSED;
      service.updatedAt = new Date();

      logger.info(`Service paused: ${id}`);
      return service;
    } catch (error) {
      logger.error(`Error pausing service ${id}:`, error);
      throw error;
    }
  }

  async resume(id, userId) {
    try {
      const service = await this.getById(id, userId);
      if (!service) {
        throw new Error('Service not found');
      }

      service.status = constants.SERVICE_STATUS.IN_PROGRESS;
      service.updatedAt = new Date();

      logger.info(`Service resumed: ${id}`);
      return service;
    } catch (error) {
      logger.error(`Error resuming service ${id}:`, error);
      throw error;
    }
  }

  async getHistory(id) {
    // Implementation would fetch from database
    return [];
  }
}

module.exports = new ServiceLifecycleService();


