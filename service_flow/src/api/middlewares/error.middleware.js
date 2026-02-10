const logger = require('../../core/logger');
const responseUtil = require('../../utils/response.util');

/**
 * Global Error Handler Middleware
 */
const errorHandler = (err, req, res, next) => {
  // Log the error
  logger.error('Error occurred:', {
    error: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
    ip: req.ip,
    userId: req.user?.id
  });

  // Handle specific error types
  if (err.name === 'ValidationError') {
    return res.status(400).json(
      responseUtil.error('Validation Error', err.details || err.message)
    );
  }

  if (err.name === 'UnauthorizedError' || err.status === 401) {
    return res.status(401).json(
      responseUtil.error('Unauthorized', 'Invalid or expired token')
    );
  }

  if (err.name === 'ForbiddenError' || err.status === 403) {
    return res.status(403).json(
      responseUtil.error('Forbidden', 'You do not have permission to access this resource')
    );
  }

  if (err.name === 'NotFoundError' || err.status === 404) {
    return res.status(404).json(
      responseUtil.error('Not Found', err.message || 'Resource not found')
    );
  }

  if (err.name === 'ConflictError' || err.status === 409) {
    return res.status(409).json(
      responseUtil.error('Conflict', err.message || 'Resource already exists')
    );
  }

  if (err.name === 'SequelizeValidationError') {
    const errors = err.errors.map(e => ({
      field: e.path,
      message: e.message
    }));
    return res.status(400).json(
      responseUtil.error('Validation Error', errors)
    );
  }

  if (err.name === 'SequelizeUniqueConstraintError') {
    return res.status(409).json(
      responseUtil.error('Conflict', 'A record with this value already exists')
    );
  }

  if (err.name === 'SequelizeForeignKeyConstraintError') {
    return res.status(400).json(
      responseUtil.error('Bad Request', 'Referenced resource does not exist')
    );
  }

  // Handle JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json(
      responseUtil.error('Unauthorized', 'Invalid token')
    );
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json(
      responseUtil.error('Unauthorized', 'Token has expired')
    );
  }

  // Default to 500 Internal Server Error
  const statusCode = err.statusCode || err.status || 500;
  const message = process.env.NODE_ENV === 'production' 
    ? 'Internal Server Error' 
    : err.message;

  return res.status(statusCode).json(
    responseUtil.error('Error', message)
  );
};

/**
 * 404 Not Found Handler
 */
const notFoundHandler = (req, res) => {
  logger.warn('Route not found:', {
    path: req.path,
    method: req.method,
    ip: req.ip
  });
  
  return res.status(404).json(
    responseUtil.error('Not Found', `Route ${req.method} ${req.path} not found`)
  );
};

/**
 * Custom Error Classes
 */
class AppError extends Error {
  constructor(message, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
    this.status = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

class ValidationError extends AppError {
  constructor(message, details = null) {
    super(message, 400);
    this.name = 'ValidationError';
    this.details = details;
  }
}

class NotFoundError extends AppError {
  constructor(message = 'Resource not found') {
    super(message, 404);
    this.name = 'NotFoundError';
  }
}

class UnauthorizedError extends AppError {
  constructor(message = 'Unauthorized') {
    super(message, 401);
    this.name = 'UnauthorizedError';
  }
}

class ForbiddenError extends AppError {
  constructor(message = 'Forbidden') {
    super(message, 403);
    this.name = 'ForbiddenError';
  }
}

class ConflictError extends AppError {
  constructor(message = 'Resource already exists') {
    super(message, 409);
    this.name = 'ConflictError';
  }
}

module.exports = {
  errorHandler,
  notFoundHandler,
  AppError,
  ValidationError,
  NotFoundError,
  UnauthorizedError,
  ForbiddenError,
  ConflictError
};

