const logger = require('../../core/logger');
const slaService = require('./sla.service');

class ApprovalEngineService {
  constructor() {
    this.approvals = [];
  }

  async getPending(userId) {
    try {
      const pending = this.approvals.filter(a => 
        a.approverId === userId && a.status === 'pending'
      );
      return pending;
    } catch (error) {
      logger.error('Error getting pending approvals:', error);
      throw error;
    }
  }

  async getById(id) {
    try {
      const approval = this.approvals.find(a => a.id === parseInt(id));
      return approval || null;
    } catch (error) {
      logger.error(`Error getting approval ${id}:`, error);
      throw error;
    }
  }

  async approve(approvalId, approverId, comment) {
    try {
      const approval = await this.getById(approvalId);
      if (!approval) {
        throw new Error('Approval not found');
      }

      if (approval.approverId !== approverId) {
        throw new Error('Not authorized to approve this request');
      }

      if (approval.status !== 'pending') {
        throw new Error('Approval is not pending');
      }

      approval.status = 'approved';
      approval.comment = comment;
      approval.decisionAt = new Date();

      // Check if all approvals are granted
      const allApprovals = this.approvals.filter(a => a.serviceId === approval.serviceId);
      const allApproved = allApprovals.every(a => a.status === 'approved' || a.status === 'pending');

      if (allApproved) {
        // Proceed to next workflow stage
        logger.info(`All approvals granted for service ${approval.serviceId}`);
      }

      logger.info(`Approval ${approvalId} granted by ${approverId}`);
      return approval;
    } catch (error) {
      logger.error(`Error approving ${approvalId}:`, error);
      throw error;
    }
  }

  async reject(approvalId, approverId, comment, reason) {
    try {
      const approval = await this.getById(approvalId);
      if (!approval) {
        throw new Error('Approval not found');
      }

      if (approval.approverId !== approverId) {
        throw new Error('Not authorized to reject this request');
      }

      approval.status = 'rejected';
      approval.comment = comment;
      approval.reason = reason;
      approval.decisionAt = new Date();

      logger.info(`Approval ${approvalId} rejected by ${approverId}`);
      return approval;
    } catch (error) {
      logger.error(`Error rejecting ${approvalId}:`, error);
      throw error;
    }
  }

  async getHistory(approvalId) {
    // Implementation would fetch from database
    return [];
  }

  async createApproval(serviceId, stageId, approverId, dueDate) {
    try {
      const approval = {
        id: Date.now(),
        serviceId,
        workflowStageId: stageId,
        approverId,
        status: 'pending',
        dueDate,
        createdAt: new Date()
      };

      this.approvals.push(approval);
      logger.info(`Approval created: ${approval.id}`);
      return approval;
    } catch (error) {
      logger.error('Error creating approval:', error);
      throw error;
    }
  }

  async checkTimeout() {
    try {
      const now = new Date();
      const overdue = this.approvals.filter(a => 
        a.status === 'pending' && a.dueDate && new Date(a.dueDate) < now
      );

      for (const approval of overdue) {
        // Escalate overdue approvals
        logger.warn(`Approval ${approval.id} is overdue`);
        // Implementation would escalate
      }

      return overdue;
    } catch (error) {
      logger.error('Error checking approval timeout:', error);
      throw error;
    }
  }
}

module.exports = new ApprovalEngineService();


