/**
 * Context Manager
 * Manages execution context for flow instances
 */
const { v4: uuidv4 } = require('uuid');

class ContextManager {
  constructor() {
    this.contexts = new Map();
  }

  /**
   * Create a new execution context
   * @param {object} flow - Flow definition
   * @param {object} input - Input data
   * @param {object} additionalContext - Additional context data
   * @returns {object} Created context
   */
  create(flow, input = {}, additionalContext = {}) {
    const contextId = uuidv4();
    
    const context = {
      id: contextId,
      flowId: flow.id,
      flowName: flow.name,
      flowVersion: flow.version,
      input: { ...input },
      output: {},
      variables: {},
      state: {
        current: null,
        history: []
      },
      metadata: {
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        ...additionalContext
      },
      errors: [],
      logs: []
    };

    this.contexts.set(contextId, context);
    return context;
  }

  /**
   * Get context by ID
   * @param {string} contextId - Context ID
   * @returns {object|null} Context or null
   */
  get(contextId) {
    return this.contexts.get(contextId) || null;
  }

  /**
   * Update context
   * @param {string} contextId - Context ID
   * @param {object} updates - Updates to apply
   * @returns {object} Updated context
   */
  update(contextId, updates) {
    const context = this.contexts.get(contextId);
    if (!context) {
      throw new Error(`Context not found: ${contextId}`);
    }

    // Deep merge updates
    Object.keys(updates).forEach(key => {
      if (typeof updates[key] === 'object' && !Array.isArray(updates[key])) {
        context[key] = { ...context[key], ...updates[key] };
      } else {
        context[key] = updates[key];
      }
    });

    context.metadata.updatedAt = new Date().toISOString();
    return context;
  }

  /**
   * Set variable in context
   * @param {string} contextId - Context ID
   * @param {string} name - Variable name
   * @param {*} value - Variable value
   */
  setVariable(contextId, name, value) {
    const context = this.contexts.get(contextId);
    if (!context) {
      throw new Error(`Context not found: ${contextId}`);
    }

    context.variables[name] = value;
    context.metadata.updatedAt = new Date().toISOString();
  }

  /**
   * Get variable from context
   * @param {string} contextId - Context ID
   * @param {string} name - Variable name
   * @returns {*} Variable value
   */
  getVariable(contextId, name) {
    const context = this.contexts.get(contextId);
    if (!context) {
      throw new Error(`Context not found: ${contextId}`);
    }

    return context.variables[name];
  }

  /**
   * Update current state
   * @param {string} contextId - Context ID
   * @param {string} stateId - New state ID
   * @param {string} stateName - State name
   */
  updateState(contextId, stateId, stateName) {
    const context = this.contexts.get(contextId);
    if (!context) {
      throw new Error(`Context not found: ${contextId}`);
    }

    // Add current state to history
    if (context.state.current) {
      context.state.history.push({
        stateId: context.state.current,
        timestamp: new Date().toISOString()
      });
    }

    context.state.current = stateId;
    context.metadata.updatedAt = new Date().toISOString();
    
    // Log state change
    this.addLog(contextId, 'info', `State changed to: ${stateName} (${stateId})`);
  }

  /**
   * Add log entry
   * @param {string} contextId - Context ID
   * @param {string} level - Log level
   * @param {string} message - Log message
   */
  addLog(contextId, level, message) {
    const context = this.contexts.get(contextId);
    if (!context) return;

    context.logs.push({
      level,
      message,
      timestamp: new Date().toISOString()
    });
  }

  /**
   * Add error
   * @param {string} contextId - Context ID
   * @param {Error} error - Error object
   */
  addError(contextId, error) {
    const context = this.contexts.get(contextId);
    if (!context) return;

    context.errors.push({
      message: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString()
    });
  }

  /**
   * Set output
   * @param {string} contextId - Context ID
   * @param {object} output - Output data
   */
  setOutput(contextId, output) {
    const context = this.contexts.get(contextId);
    if (!context) {
      throw new Error(`Context not found: ${contextId}`);
    }

    context.output = { ...context.output, ...output };
    context.metadata.updatedAt = new Date().toISOString();
  }

  /**
   * Delete context
   * @param {string} contextId - Context ID
   */
  delete(contextId) {
    this.contexts.delete(contextId);
  }

  /**
   * Get all contexts
   * @returns {Array} All contexts
   */
  getAll() {
    return Array.from(this.contexts.values());
  }
}

// Export singleton instance
module.exports = new ContextManager();
