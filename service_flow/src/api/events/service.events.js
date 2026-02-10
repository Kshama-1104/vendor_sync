const EventEmitter = require('events');
const logger = require('../../core/logger');

class ServiceEvents extends EventEmitter {
  constructor() {
    super();
    this.setupListeners();
  }

  setupListeners() {
    // Service Created
    this.on('service.created', (data) => {
      logger.info('Service created event:', { serviceId: data.serviceId, userId: data.userId });
    });

    // Service Updated
    this.on('service.updated', (data) => {
      logger.info('Service updated event:', { serviceId: data.serviceId, changes: data.changes });
    });

    // Service Status Changed
    this.on('service.statusChanged', (data) => {
      logger.info('Service status changed:', { 
        serviceId: data.serviceId, 
        oldStatus: data.oldStatus, 
        newStatus: data.newStatus 
      });
    });

    // Service Submitted
    this.on('service.submitted', (data) => {
      logger.info('Service submitted for processing:', { serviceId: data.serviceId });
    });

    // Service Approved
    this.on('service.approved', (data) => {
      logger.info('Service approved:', { serviceId: data.serviceId, approvedBy: data.approvedBy });
    });

    // Service Rejected
    this.on('service.rejected', (data) => {
      logger.info('Service rejected:', { serviceId: data.serviceId, rejectedBy: data.rejectedBy, reason: data.reason });
    });

    // Service Completed
    this.on('service.completed', (data) => {
      logger.info('Service completed:', { serviceId: data.serviceId, completedAt: data.completedAt });
    });

    // Service Cancelled
    this.on('service.cancelled', (data) => {
      logger.info('Service cancelled:', { serviceId: data.serviceId, cancelledBy: data.cancelledBy });
    });

    // Approval Required
    this.on('approval.required', (data) => {
      logger.info('Approval required:', { serviceId: data.serviceId, approvers: data.approvers });
    });

    // Approval Completed
    this.on('approval.completed', (data) => {
      logger.info('Approval completed:', { serviceId: data.serviceId, status: data.status });
    });

    // SLA Warning
    this.on('sla.warning', (data) => {
      logger.warn('SLA warning:', { serviceId: data.serviceId, timeRemaining: data.timeRemaining });
    });

    // SLA Breached
    this.on('sla.breached', (data) => {
      logger.error('SLA breached:', { serviceId: data.serviceId, breachedAt: data.breachedAt });
    });

    // Task Assigned
    this.on('task.assigned', (data) => {
      logger.info('Task assigned:', { taskId: data.taskId, assignedTo: data.assignedTo });
    });

    // Task Completed
    this.on('task.completed', (data) => {
      logger.info('Task completed:', { taskId: data.taskId, completedBy: data.completedBy });
    });

    // Comment Added
    this.on('comment.added', (data) => {
      logger.info('Comment added:', { serviceId: data.serviceId, commentId: data.commentId });
    });

    // Attachment Added
    this.on('attachment.added', (data) => {
      logger.info('Attachment added:', { serviceId: data.serviceId, fileName: data.fileName });
    });

    // Error handling
    this.on('error', (error) => {
      logger.error('Service event error:', { error: error.message, stack: error.stack });
    });
  }

  // Emit methods for type safety and consistency
  emitServiceCreated(serviceId, userId, serviceData) {
    this.emit('service.created', { serviceId, userId, serviceData, timestamp: new Date() });
  }

  emitServiceUpdated(serviceId, changes, updatedBy) {
    this.emit('service.updated', { serviceId, changes, updatedBy, timestamp: new Date() });
  }

  emitStatusChanged(serviceId, oldStatus, newStatus, changedBy) {
    this.emit('service.statusChanged', { serviceId, oldStatus, newStatus, changedBy, timestamp: new Date() });
  }

  emitServiceSubmitted(serviceId, submittedBy) {
    this.emit('service.submitted', { serviceId, submittedBy, timestamp: new Date() });
  }

  emitServiceApproved(serviceId, approvedBy, comments) {
    this.emit('service.approved', { serviceId, approvedBy, comments, timestamp: new Date() });
  }

  emitServiceRejected(serviceId, rejectedBy, reason) {
    this.emit('service.rejected', { serviceId, rejectedBy, reason, timestamp: new Date() });
  }

  emitServiceCompleted(serviceId, completedBy) {
    this.emit('service.completed', { serviceId, completedBy, completedAt: new Date() });
  }

  emitServiceCancelled(serviceId, cancelledBy, reason) {
    this.emit('service.cancelled', { serviceId, cancelledBy, reason, timestamp: new Date() });
  }

  emitApprovalRequired(serviceId, approvers, deadline) {
    this.emit('approval.required', { serviceId, approvers, deadline, timestamp: new Date() });
  }

  emitApprovalCompleted(serviceId, status, completedBy) {
    this.emit('approval.completed', { serviceId, status, completedBy, timestamp: new Date() });
  }

  emitSLAWarning(serviceId, timeRemaining, threshold) {
    this.emit('sla.warning', { serviceId, timeRemaining, threshold, timestamp: new Date() });
  }

  emitSLABreached(serviceId) {
    this.emit('sla.breached', { serviceId, breachedAt: new Date() });
  }

  emitTaskAssigned(taskId, serviceId, assignedTo, assignedBy) {
    this.emit('task.assigned', { taskId, serviceId, assignedTo, assignedBy, timestamp: new Date() });
  }

  emitTaskCompleted(taskId, serviceId, completedBy) {
    this.emit('task.completed', { taskId, serviceId, completedBy, timestamp: new Date() });
  }

  emitCommentAdded(serviceId, commentId, addedBy) {
    this.emit('comment.added', { serviceId, commentId, addedBy, timestamp: new Date() });
  }

  emitAttachmentAdded(serviceId, attachmentId, fileName, addedBy) {
    this.emit('attachment.added', { serviceId, attachmentId, fileName, addedBy, timestamp: new Date() });
  }
}

// Export singleton instance
module.exports = new ServiceEvents();
