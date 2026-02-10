const logger = require('../../core/logger');
const workerManager = require('../../core/worker/worker-manager');

class WorkerService {
  async register(workerData) {
    try {
      const worker = {
        id: Date.now().toString(),
        name: workerData.name,
        queues: workerData.queues || [],
        concurrency: workerData.concurrency || 10,
        status: 'active',
        registeredAt: new Date(),
        lastHeartbeat: new Date()
      };

      await workerManager.register(worker);
      logger.info(`Worker registered: ${worker.id}`);
      return worker;
    } catch (error) {
      logger.error('Error registering worker:', error);
      throw error;
    }
  }

  async getStatus(id) {
    try {
      const status = await workerManager.getStatus(id);
      return status;
    } catch (error) {
      logger.error(`Error getting worker status ${id}:`, error);
      throw error;
    }
  }

  async list(options = {}) {
    try {
      const workers = await workerManager.list(options);
      return workers;
    } catch (error) {
      logger.error('Error listing workers:', error);
      throw error;
    }
  }

  async update(id, workerData) {
    try {
      const worker = await workerManager.update(id, workerData);
      logger.info(`Worker updated: ${id}`);
      return worker;
    } catch (error) {
      logger.error(`Error updating worker ${id}:`, error);
      throw error;
    }
  }

  async deregister(id) {
    try {
      await workerManager.deregister(id);
      logger.info(`Worker deregistered: ${id}`);
      return true;
    } catch (error) {
      logger.error(`Error deregistering worker ${id}:`, error);
      throw error;
    }
  }

  async scale(queueName, targetCount) {
    try {
      const result = await workerManager.scale(queueName, targetCount);
      logger.info(`Workers scaled for queue ${queueName} to ${targetCount}`);
      return result;
    } catch (error) {
      logger.error(`Error scaling workers for queue ${queueName}:`, error);
      throw error;
    }
  }
}

module.exports = new WorkerService();


