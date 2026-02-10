const logger = require('../logger');
const transitionHandler = require('./transition-handler');
const rollbackManager = require('./rollback-manager');
const contextManager = require('./context-manager');
const executionService = require('../../api/services/execution.service');
const internalEvents = require('../../api/events/internal.events');
const executionConfig = require('../../../config/execution.config');

class FlowExecutor {
  async execute(flow, execution) {
    try {
      logger.info(`Executing flow: ${flow.id} (execution: ${execution.id})`);

      internalEvents.emit('flow.started', {
        flowId: flow.id,
        executionId: execution.id
      });

      // Find start state
      const startState = flow.states.find(s => s.type === 'start');
      if (!startState) {
        throw new Error('Flow must have a start state');
      }

      // Initialize execution
      execution.currentState = startState.id;
      execution.context = contextManager.create(flow, execution.input, execution.context);

      // Execute flow
      await this.executeState(flow, execution, startState);

      // Mark as completed
      execution.status = 'completed';
      execution.completedAt = new Date();

      internalEvents.emit('flow.completed', {
        flowId: flow.id,
        executionId: execution.id
      });

      logger.info(`Flow execution completed: ${execution.id}`);
      return execution;
    } catch (error) {
      logger.error(`Flow execution failed: ${execution.id}`, error);
      execution.status = 'failed';
      execution.error = error.message;
      execution.completedAt = new Date();

      internalEvents.emit('flow.failed', {
        flowId: flow.id,
        executionId: execution.id,
        error: error.message
      });

      // Attempt rollback
      if (executionConfig.errorHandling.enableErrorRecovery) {
        await rollbackManager.rollback(flow, execution);
      }

      throw error;
    }
  }

  async executeState(flow, execution, state) {
    try {
      logger.debug(`Executing state: ${state.id} in flow ${flow.id}`);

      internalEvents.emit('state.entered', {
        flowId: flow.id,
        executionId: execution.id,
        stateId: state.id
      });

      // Execute entry actions
      if (state.entry && state.entry.actions) {
        await executionService.executeActions(state.entry.actions, execution.context);
      }

      // Execute state actions
      if (state.actions && state.actions.length > 0) {
        const parallel = state.type === 'parallel';
        await executionService.executeActions(state.actions, execution.context, parallel);
      }

      // Execute exit actions
      if (state.exit && state.exit.actions) {
        await executionService.executeActions(state.exit.actions, execution.context);
      }

      internalEvents.emit('state.exited', {
        flowId: flow.id,
        executionId: execution.id,
        stateId: state.id
      });

      // Find and execute transitions
      const transitions = flow.transitions.filter(t => t.from === state.id);
      for (const transition of transitions) {
        const canTransition = await transitionHandler.canTransition(transition, execution.context);
        if (canTransition) {
          const nextState = flow.states.find(s => s.id === transition.to);
          if (nextState) {
            if (nextState.type === 'end') {
              // Flow completed
              return;
            }
            // Continue to next state
            execution.currentState = nextState.id;
            await this.executeState(flow, execution, nextState);
            return;
          }
        }
      }

      // No valid transition found
      if (state.type !== 'end') {
        throw new Error(`No valid transition from state ${state.id}`);
      }
    } catch (error) {
      logger.error(`Error executing state ${state.id}:`, error);
      
      // Handle state-level errors
      if (state.onError) {
        if (state.onError.handler) {
          await executionService.executeAction({ type: 'callService', handler: state.onError.handler }, execution.context);
        }
        if (state.onError.transition) {
          const errorState = flow.states.find(s => s.id === state.onError.transition);
          if (errorState) {
            execution.currentState = errorState.id;
            await this.executeState(flow, execution, errorState);
            return;
          }
        }
      }

      throw error;
    }
  }
}

module.exports = new FlowExecutor();


