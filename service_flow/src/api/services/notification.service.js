const logger = require('../../core/logger');
const notificationConfig = require('../../../config/notification.config');

class NotificationService {
  async sendServiceNotification(serviceId, type, params = {}) {
    try {
      logger.info(`Sending ${type} notification for service ${serviceId}`);

      // Send in-app notification
      if (notificationConfig.inApp.enabled) {
        await this.sendInAppNotification(serviceId, type, params);
      }

      // Send email if configured
      if (notificationConfig.email.enabled && params.email) {
        await this.sendEmail(serviceId, type, params);
      }

      // Send SMS if configured
      if (notificationConfig.sms.enabled && params.sms) {
        await this.sendSMS(serviceId, type, params);
      }

      return { success: true };
    } catch (error) {
      logger.error('Error sending notification:', error);
      throw error;
    }
  }

  async sendInAppNotification(serviceId, type, params) {
    logger.info(`In-app notification sent for service ${serviceId}`);
    return true;
  }

  async sendEmail(serviceId, type, params) {
    logger.info(`Email sent for service ${serviceId}`);
    return true;
  }

  async sendSMS(serviceId, type, params) {
    logger.info(`SMS sent for service ${serviceId}`);
    return true;
  }

  async sendApprovalNotification(approvalId, type) {
    return await this.sendServiceNotification(approvalId, type, {
      template: notificationConfig.templates[type] || 'approval_notification'
    });
  }

  async sendSLABreachNotification(serviceId) {
    return await this.sendServiceNotification(serviceId, 'sla_breach', {
      template: notificationConfig.templates.slaBreach
    });
  }

  async sendEscalationNotification(serviceId) {
    return await this.sendServiceNotification(serviceId, 'escalation', {
      template: notificationConfig.templates.escalation
    });
  }
}

module.exports = new NotificationService();


