const rateLimit = require('express-rate-limit');

const createRateLimiter = (windowMs, max, message) => {
  return rateLimit({
    windowMs,
    max,
    message: message || 'Too many requests, please try again later.',
    standardHeaders: true,
    legacyHeaders: false,
  });
};

// General API rate limiter
const apiLimiter = createRateLimiter(
  15 * 60 * 1000, // 15 minutes
  100, // 100 requests
  'Too many API requests, please try again later.'
);

// Strict rate limiter for sensitive operations
const strictLimiter = createRateLimiter(
  15 * 60 * 1000, // 15 minutes
  10, // 10 requests
  'Too many requests for this operation, please try again later.'
);

// Auth rate limiter
const authLimiter = createRateLimiter(
  15 * 60 * 1000, // 15 minutes
  5, // 5 requests
  'Too many authentication attempts, please try again later.'
);

module.exports = {
  apiLimiter,
  strictLimiter,
  authLimiter
};


