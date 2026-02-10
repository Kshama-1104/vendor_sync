const logger = require('../logger');

class WorkerManager {
  constructor() {
    this.workers = new Map();
  }

  async register(worker) {
    try {
      this.workers.set(worker.id, {
        ...worker,
        status: 'active',
        registeredAt: new Date(),
        lastHeartbeat: new Date(),
        processedCount: 0,
        failedCount: 0
      });

      logger.info(`Worker registered: ${worker.id}`);
      return worker;
    } catch (error) {
      logger.error(`Error registering worker: ${error.message}`);
      throw error;
    }
  }

  async getStatus(id) {
    try {
      const worker = this.workers.get(id);
      if (!worker) {
        return null;
      }

      return {
        id: worker.id,
        name: worker.name,
        queues: worker.queues,
        concurrency: worker.concurrency,
        status: worker.status,
        processedCount: worker.processedCount || 0,
        failedCount: worker.failedCount || 0,
        registeredAt: worker.registeredAt,
        lastHeartbeat: worker.lastHeartbeat
      };
    } catch (error) {
      logger.error(`Error getting worker status: ${error.message}`);
      throw error;
    }
  }

  async list(options = {}) {
    try {
      let workers = Array.from(this.workers.values());

      if (options.queueName) {
        workers = workers.filter(w => w.queues.includes(options.queueName));
      }

      if (options.status) {
        workers = workers.filter(w => w.status === options.status);
      }

      return workers;
    } catch (error) {
      logger.error(`Error listing workers: ${error.message}`);
      throw error;
    }
  }

  async update(id, updates) {
    try {
      const worker = this.workers.get(id);
      if (!worker) {
        throw new Error('Worker not found');
      }

      Object.assign(worker, updates, { updatedAt: new Date() });
      this.workers.set(id, worker);

      logger.info(`Worker updated: ${id}`);
      return worker;
    } catch (error) {
      logger.error(`Error updating worker: ${error.message}`);
      throw error;
    }
  }

  async deregister(id) {
    try {
      const worker = this.workers.get(id);
      if (!worker) {
        throw new Error('Worker not found');
      }

      this.workers.delete(id);
      logger.info(`Worker deregistered: ${id}`);
      return true;
    } catch (error) {
      logger.error(`Error deregistering worker: ${error.message}`);
      throw error;
    }
  }

  async scale(queueName, targetCount) {
    try {
      const currentWorkers = await this.list({ queueName });
      const currentCount = currentWorkers.length;

      if (targetCount > currentCount) {
        // Scale up
        const toAdd = targetCount - currentCount;
        for (let i = 0; i < toAdd; i++) {
          await this.register({
            id: `${Date.now()}-${i}`,
            name: `worker-${queueName}-${i}`,
            queues: [queueName],
            concurrency: 10
          });
        }
        logger.info(`Scaled up workers for ${queueName}: ${currentCount} -> ${targetCount}`);
      } else if (targetCount < currentCount) {
        // Scale down
        const toRemove = currentCount - targetCount;
        const workersToRemove = currentWorkers.slice(0, toRemove);
        for (const worker of workersToRemove) {
          await this.deregister(worker.id);
        }
        logger.info(`Scaled down workers for ${queueName}: ${currentCount} -> ${targetCount}`);
      }

      return {
        queueName,
        previousCount: currentCount,
        targetCount,
        currentCount: targetCount
      };
    } catch (error) {
      logger.error(`Error scaling workers: ${error.message}`);
      throw error;
    }
  }

  async heartbeat(id) {
    try {
      const worker = this.workers.get(id);
      if (worker) {
        worker.lastHeartbeat = new Date();
        this.workers.set(id, worker);
      }
    } catch (error) {
      logger.error(`Error updating worker heartbeat: ${error.message}`);
    }
  }
}

module.exports = new WorkerManager();


