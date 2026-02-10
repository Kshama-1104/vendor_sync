const logger = require('../logger');

class RollbackManager {
  constructor() {
    this.snapshots = new Map();
  }

  async createSnapshot(flow, execution) {
    try {
      const snapshot = {
        executionId: execution.id,
        flowId: flow.id,
        state: execution.currentState,
        context: JSON.parse(JSON.stringify(execution.context)),
        timestamp: new Date()
      };

      this.snapshots.set(execution.id, snapshot);
      logger.debug(`Snapshot created for execution: ${execution.id}`);
      return snapshot;
    } catch (error) {
      logger.error('Error creating snapshot:', error);
      throw error;
    }
  }

  async rollback(flow, execution) {
    try {
      const snapshot = this.snapshots.get(execution.id);
      if (!snapshot) {
        logger.warn(`No snapshot found for execution: ${execution.id}`);
        return false;
      }

      logger.info(`Rolling back execution: ${execution.id} to state ${snapshot.state}`);

      // Restore execution state
      execution.currentState = snapshot.state;
      execution.context = snapshot.context;
      execution.status = 'rolled_back';
      execution.rolledBackAt = new Date();

      logger.info(`Execution rolled back: ${execution.id}`);
      return true;
    } catch (error) {
      logger.error(`Error rolling back execution ${execution.id}:`, error);
      throw error;
    }
  }

  async getSnapshot(executionId) {
    return this.snapshots.get(executionId);
  }

  async deleteSnapshot(executionId) {
    this.snapshots.delete(executionId);
  }
}

module.exports = new RollbackManager();


