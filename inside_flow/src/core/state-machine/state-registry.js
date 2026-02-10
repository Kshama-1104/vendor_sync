/**
 * State Registry
 * Manages state registration and retrieval for flows
 */
const logger = require('../logger');

class StateRegistry {
  constructor() {
    this.states = new Map(); // flowId -> states[]
  }

  async getStates(flowId) {
    try {
      return this.states.get(flowId) || [];
    } catch (error) {
      logger.error(`Error getting states for flow ${flowId}:`, error);
      throw error;
    }
  }

  async getState(flowId, stateId) {
    try {
      const states = this.states.get(flowId) || [];
      return states.find(s => s.id === stateId || s.id === parseInt(stateId)) || null;
    } catch (error) {
      logger.error(`Error getting state ${stateId} for flow ${flowId}:`, error);
      throw error;
    }
  }

  async register(flowId, state) {
    try {
      const states = this.states.get(flowId) || [];
      
      // Check for duplicate
      const existingIndex = states.findIndex(s => s.id === state.id);
      if (existingIndex !== -1) {
        states[existingIndex] = state;
      } else {
        states.push(state);
      }

      this.states.set(flowId, states);
      logger.info(`State registered: ${state.id} for flow ${flowId}`);
      return state;
    } catch (error) {
      logger.error(`Error registering state for flow ${flowId}:`, error);
      throw error;
    }
  }

  async update(flowId, stateId, updatedState) {
    try {
      const states = this.states.get(flowId) || [];
      const index = states.findIndex(s => s.id === stateId || s.id === parseInt(stateId));
      
      if (index === -1) {
        throw new Error(`State ${stateId} not found for flow ${flowId}`);
      }

      states[index] = { ...states[index], ...updatedState };
      this.states.set(flowId, states);
      
      return states[index];
    } catch (error) {
      logger.error(`Error updating state ${stateId} for flow ${flowId}:`, error);
      throw error;
    }
  }

  async unregister(flowId, stateId) {
    try {
      const states = this.states.get(flowId) || [];
      const filtered = states.filter(s => s.id !== stateId && s.id !== parseInt(stateId));
      this.states.set(flowId, filtered);
      
      logger.info(`State unregistered: ${stateId} for flow ${flowId}`);
      return true;
    } catch (error) {
      logger.error(`Error unregistering state ${stateId} for flow ${flowId}:`, error);
      throw error;
    }
  }

  async clear(flowId) {
    this.states.delete(flowId);
  }
}

module.exports = new StateRegistry();
