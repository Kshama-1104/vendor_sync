const logger = require('../../core/logger');
const stateRegistry = require('../../core/state-machine/state-registry');
const transitionValidator = require('../../core/state-machine/transition-validator');

class StateManagerService {
  async getStates(flowId) {
    try {
      const states = await stateRegistry.getStates(flowId);
      return states;
    } catch (error) {
      logger.error(`Error getting states for flow ${flowId}:`, error);
      throw error;
    }
  }

  async getById(flowId, stateId) {
    try {
      const state = await stateRegistry.getState(flowId, stateId);
      return state || null;
    } catch (error) {
      logger.error(`Error getting state ${stateId} for flow ${flowId}:`, error);
      throw error;
    }
  }

  async create(flowId, stateData) {
    try {
      // Validate state
      this.validateState(stateData);

      const state = {
        id: stateData.id || Date.now().toString(),
        ...stateData,
        flowId,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      await stateRegistry.register(flowId, state);
      logger.info(`State created: ${state.id} for flow ${flowId}`);
      return state;
    } catch (error) {
      logger.error(`Error creating state for flow ${flowId}:`, error);
      throw error;
    }
  }

  async update(flowId, stateId, stateData) {
    try {
      const state = await this.getById(flowId, stateId);
      if (!state) {
        throw new Error('State not found');
      }

      // Validate updated state
      this.validateState({ ...state, ...stateData });

      const updatedState = {
        ...state,
        ...stateData,
        updatedAt: new Date()
      };

      await stateRegistry.update(flowId, stateId, updatedState);
      logger.info(`State updated: ${stateId} for flow ${flowId}`);
      return updatedState;
    } catch (error) {
      logger.error(`Error updating state ${stateId} for flow ${flowId}:`, error);
      throw error;
    }
  }

  async delete(flowId, stateId) {
    try {
      await stateRegistry.unregister(flowId, stateId);
      logger.info(`State deleted: ${stateId} for flow ${flowId}`);
      return true;
    } catch (error) {
      logger.error(`Error deleting state ${stateId} for flow ${flowId}:`, error);
      throw error;
    }
  }

  validateState(state) {
    if (!state.id && !state.name) {
      throw new Error('State must have id or name');
    }

    const validTypes = ['start', 'normal', 'decision', 'parallel', 'end'];
    if (state.type && !validTypes.includes(state.type)) {
      throw new Error(`Invalid state type: ${state.type}`);
    }
  }
}

module.exports = new StateManagerService();


