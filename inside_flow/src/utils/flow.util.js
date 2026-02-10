/**
 * Flow Utility Functions
 */

const flowUtil = {
  /**
   * Validate flow structure
   * @param {object} flow - Flow definition
   * @throws {Error} If validation fails
   */
  validateFlow(flow) {
    if (!flow.name || typeof flow.name !== 'string') {
      throw new Error('Flow name is required and must be a string');
    }

    if (!flow.states || !Array.isArray(flow.states) || flow.states.length === 0) {
      throw new Error('Flow must have at least one state');
    }

    // Check for start state
    const startState = flow.states.find(s => s.type === 'start');
    if (!startState) {
      throw new Error('Flow must have a start state');
    }

    // Validate each state
    flow.states.forEach(state => {
      if (!state.id || !state.name) {
        throw new Error('Each state must have an id and name');
      }
    });

    // Validate transitions if present
    if (flow.transitions) {
      flow.transitions.forEach(transition => {
        if (!transition.from || !transition.to) {
          throw new Error('Each transition must have from and to states');
        }

        // Check if states exist
        const fromExists = flow.states.some(s => s.id === transition.from);
        const toExists = flow.states.some(s => s.id === transition.to);

        if (!fromExists) {
          throw new Error(`Transition from state '${transition.from}' does not exist`);
        }
        if (!toExists) {
          throw new Error(`Transition to state '${transition.to}' does not exist`);
        }
      });
    }

    return true;
  },

  /**
   * Paginate array
   * @param {Array} items - Items to paginate
   * @param {number} page - Page number (1-indexed)
   * @param {number} limit - Items per page
   * @returns {object} Paginated result
   */
  paginate(items, page = 1, limit = 10) {
    const total = items.length;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const data = items.slice(startIndex, endIndex);

    return {
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNext: endIndex < total,
        hasPrev: page > 1
      }
    };
  },

  /**
   * Generate unique ID
   * @returns {string} Unique ID
   */
  generateId() {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  },

  /**
   * Deep clone object
   * @param {object} obj - Object to clone
   * @returns {object} Cloned object
   */
  deepClone(obj) {
    return JSON.parse(JSON.stringify(obj));
  },

  /**
   * Check if flow is in a valid state
   * @param {object} flow - Flow object
   * @param {string} stateId - State ID to check
   * @returns {boolean} Whether state is valid
   */
  isValidState(flow, stateId) {
    return flow.states && flow.states.some(s => s.id === stateId);
  },

  /**
   * Get available transitions from a state
   * @param {object} flow - Flow object
   * @param {string} stateId - Current state ID
   * @returns {Array} Available transitions
   */
  getAvailableTransitions(flow, stateId) {
    if (!flow.transitions) return [];
    return flow.transitions.filter(t => t.from === stateId);
  },

  /**
   * Check if transition is allowed
   * @param {object} flow - Flow object
   * @param {string} fromState - Current state
   * @param {string} toState - Target state
   * @returns {boolean} Whether transition is allowed
   */
  canTransition(flow, fromState, toState) {
    if (!flow.transitions) return false;
    return flow.transitions.some(t => t.from === fromState && t.to === toState);
  }
};

module.exports = flowUtil;
