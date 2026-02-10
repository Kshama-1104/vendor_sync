const logger = require('../logger');
const EventEmitter = require('events');

/**
 * State Machine - Manages workflow state transitions
 */
class StateMachine extends EventEmitter {
  constructor() {
    super();
    this.states = new Map();
    this.transitions = new Map();
    this.currentStates = new Map(); // workflowId -> currentState
  }

  /**
   * Define states for a workflow type
   */
  defineStates(workflowType, states) {
    this.states.set(workflowType, states);
    logger.info(`States defined for workflow type: ${workflowType}`);
  }

  /**
   * Define valid transitions for a workflow type
   */
  defineTransitions(workflowType, transitions) {
    this.transitions.set(workflowType, transitions);
    logger.info(`Transitions defined for workflow type: ${workflowType}`);
  }

  /**
   * Initialize default states and transitions
   */
  initialize() {
    // Default service request states
    const serviceStates = [
      'draft',
      'submitted',
      'pending_approval',
      'approved',
      'rejected',
      'in_progress',
      'on_hold',
      'completed',
      'cancelled',
      'closed'
    ];

    // Default service request transitions
    const serviceTransitions = {
      draft: ['submitted', 'cancelled'],
      submitted: ['pending_approval', 'in_progress', 'rejected', 'cancelled'],
      pending_approval: ['approved', 'rejected', 'cancelled'],
      approved: ['in_progress', 'cancelled'],
      rejected: ['draft', 'closed'],
      in_progress: ['on_hold', 'completed', 'cancelled'],
      on_hold: ['in_progress', 'cancelled'],
      completed: ['closed'],
      cancelled: ['closed'],
      closed: []
    };

    this.defineStates('service', serviceStates);
    this.defineTransitions('service', serviceTransitions);

    // Approval states
    const approvalStates = ['pending', 'approved', 'rejected', 'escalated', 'expired'];
    const approvalTransitions = {
      pending: ['approved', 'rejected', 'escalated', 'expired'],
      approved: [],
      rejected: [],
      escalated: ['approved', 'rejected'],
      expired: ['escalated']
    };

    this.defineStates('approval', approvalStates);
    this.defineTransitions('approval', approvalTransitions);

    // Task states
    const taskStates = ['pending', 'in_progress', 'completed', 'blocked', 'cancelled'];
    const taskTransitions = {
      pending: ['in_progress', 'cancelled'],
      in_progress: ['completed', 'blocked', 'cancelled'],
      blocked: ['in_progress', 'cancelled'],
      completed: [],
      cancelled: []
    };

    this.defineStates('task', taskStates);
    this.defineTransitions('task', taskTransitions);
  }

  /**
   * Check if transition is valid
   */
  canTransition(workflowType, fromState, toState) {
    const transitions = this.transitions.get(workflowType);
    if (!transitions) {
      logger.warn(`No transitions defined for workflow type: ${workflowType}`);
      return false;
    }

    const validTransitions = transitions[fromState];
    if (!validTransitions) {
      logger.warn(`No transitions defined from state: ${fromState}`);
      return false;
    }

    return validTransitions.includes(toState);
  }

  /**
   * Execute state transition
   */
  transition(workflowType, workflowId, fromState, toState, context = {}) {
    if (!this.canTransition(workflowType, fromState, toState)) {
      const error = new Error(`Invalid transition from ${fromState} to ${toState}`);
      logger.error(error.message, { workflowType, workflowId, fromState, toState });
      throw error;
    }

    // Update current state
    this.currentStates.set(workflowId, toState);

    // Emit transition event
    this.emit('transition', {
      workflowType,
      workflowId,
      fromState,
      toState,
      context,
      timestamp: new Date()
    });

    logger.info(`State transition: ${fromState} -> ${toState}`, {
      workflowType,
      workflowId
    });

    return {
      success: true,
      previousState: fromState,
      currentState: toState,
      timestamp: new Date()
    };
  }

  /**
   * Get current state of a workflow
   */
  getCurrentState(workflowId) {
    return this.currentStates.get(workflowId) || null;
  }

  /**
   * Get available transitions from current state
   */
  getAvailableTransitions(workflowType, currentState) {
    const transitions = this.transitions.get(workflowType);
    if (!transitions) return [];
    return transitions[currentState] || [];
  }

  /**
   * Get all states for a workflow type
   */
  getStates(workflowType) {
    return this.states.get(workflowType) || [];
  }

  /**
   * Check if state is final (no outgoing transitions)
   */
  isFinalState(workflowType, state) {
    const transitions = this.transitions.get(workflowType);
    if (!transitions) return false;
    const available = transitions[state];
    return !available || available.length === 0;
  }
}

// Export singleton with initialized states
const stateMachine = new StateMachine();
stateMachine.initialize();

module.exports = stateMachine;
