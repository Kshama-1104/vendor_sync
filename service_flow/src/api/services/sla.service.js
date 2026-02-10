const logger = require('../../core/logger');
const slaConfig = require('../../../config/sla.config');
const dateUtil = require('../../utils/date.util');

class SLAService {
  constructor() {
    this.slas = [];
    this.tracking = [];
  }

  async getStatus(serviceId) {
    try {
      const track = this.tracking.find(t => t.serviceId === parseInt(serviceId));
      if (!track) {
        return null;
      }

      const now = new Date();
      const responseDeadline = new Date(track.responseDeadline);
      const resolutionDeadline = new Date(track.resolutionDeadline);

      return {
        serviceId: track.serviceId,
        slaId: track.slaId,
        responseDeadline: track.responseDeadline,
        resolutionDeadline: track.resolutionDeadline,
        responseTime: track.responseTime,
        resolutionTime: track.resolutionTime,
        responseBreached: responseDeadline < now && !track.responseTime,
        resolutionBreached: resolutionDeadline < now && !track.resolutionTime,
        status: track.status
      };
    } catch (error) {
      logger.error(`Error getting SLA status for service ${serviceId}:`, error);
      throw error;
    }
  }

  async getViolations(options = {}) {
    try {
      let violations = this.tracking.filter(t => t.breached);

      if (options.startDate) {
        violations = violations.filter(v => new Date(v.createdAt) >= new Date(options.startDate));
      }

      if (options.endDate) {
        violations = violations.filter(v => new Date(v.createdAt) <= new Date(options.endDate));
      }

      return violations;
    } catch (error) {
      logger.error('Error getting SLA violations:', error);
      throw error;
    }
  }

  async getMetrics(startDate, endDate) {
    try {
      const now = new Date();
      const thirtyDaysAgo = new Date(now);
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      const period = {
        start: startDate ? new Date(startDate) : thirtyDaysAgo,
        end: endDate ? new Date(endDate) : now
      };

      const tracks = this.tracking.filter(t => {
        const createdAt = new Date(t.createdAt);
        return createdAt >= period.start && createdAt <= period.end;
      });

      const total = tracks.length;
      const breached = tracks.filter(t => t.breached).length;
      const complianceRate = total > 0 ? ((total - breached) / total) * 100 : 100;

      const avgResponseTime = this.calculateAverage(tracks.map(t => t.responseTime));
      const avgResolutionTime = this.calculateAverage(tracks.map(t => t.resolutionTime));

      return {
        period,
        total,
        breached,
        complianceRate: Math.round(complianceRate * 100) / 100,
        averageResponseTime: avgResponseTime,
        averageResolutionTime: avgResolutionTime
      };
    } catch (error) {
      logger.error('Error getting SLA metrics:', error);
      throw error;
    }
  }

  calculateAverage(values) {
    const validValues = values.filter(v => v !== null && v !== undefined);
    if (validValues.length === 0) return 0;
    const sum = validValues.reduce((a, b) => a + b, 0);
    return Math.round(sum / validValues.length);
  }

  async getByService(serviceId) {
    try {
      const track = this.tracking.find(t => t.serviceId === parseInt(serviceId));
      if (!track) {
        return null;
      }

      const sla = this.slas.find(s => s.id === track.slaId);
      return {
        ...track,
        sla: sla
      };
    } catch (error) {
      logger.error(`Error getting SLA for service ${serviceId}:`, error);
      throw error;
    }
  }

  async createTracking(serviceId, slaId, priority) {
    try {
      const sla = this.slas.find(s => s.id === slaId);
      if (!sla) {
        throw new Error('SLA not found');
      }

      // Get SLA times based on priority
      const prioritySLA = slaConfig.priorityBased[priority] || slaConfig.priorityBased.medium;
      const responseTime = prioritySLA.responseTime * 60 * 60 * 1000; // Convert to milliseconds
      const resolutionTime = prioritySLA.resolutionTime * 60 * 60 * 1000;

      const now = new Date();
      const track = {
        id: Date.now(),
        serviceId,
        slaId,
        responseDeadline: new Date(now.getTime() + responseTime),
        resolutionDeadline: new Date(now.getTime() + resolutionTime),
        responseTime: null,
        resolutionTime: null,
        status: 'active',
        breached: false,
        createdAt: now
      };

      this.tracking.push(track);
      logger.info(`SLA tracking created for service ${serviceId}`);
      return track;
    } catch (error) {
      logger.error('Error creating SLA tracking:', error);
      throw error;
    }
  }

  async updateResponseTime(serviceId, responseTime) {
    try {
      const track = this.tracking.find(t => t.serviceId === parseInt(serviceId));
      if (!track) {
        throw new Error('SLA tracking not found');
      }

      track.responseTime = responseTime;
      track.updatedAt = new Date();

      // Check for breach
      if (new Date(track.responseDeadline) < new Date() && !track.responseTime) {
        track.breached = true;
      }

      logger.info(`SLA response time updated for service ${serviceId}`);
      return track;
    } catch (error) {
      logger.error(`Error updating SLA response time for service ${serviceId}:`, error);
      throw error;
    }
  }

  async updateResolutionTime(serviceId, resolutionTime) {
    try {
      const track = this.tracking.find(t => t.serviceId === parseInt(serviceId));
      if (!track) {
        throw new Error('SLA tracking not found');
      }

      track.resolutionTime = resolutionTime;
      track.status = 'completed';
      track.updatedAt = new Date();

      // Check for breach
      if (new Date(track.resolutionDeadline) < new Date() && !track.resolutionTime) {
        track.breached = true;
      }

      logger.info(`SLA resolution time updated for service ${serviceId}`);
      return track;
    } catch (error) {
      logger.error(`Error updating SLA resolution time for service ${serviceId}:`, error);
      throw error;
    }
  }
}

module.exports = new SLAService();


