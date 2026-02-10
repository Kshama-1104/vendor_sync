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

const apiLimiter = createRateLimiter(
  15 * 60 * 1000,
  1000,
  'Too many API requests, please try again later.'
);

const strictLimiter = createRateLimiter(
  15 * 60 * 1000,
  100,
  'Too many requests for this operation, please try again later.'
);

const publishLimiter = createRateLimiter(
  60 * 1000,
  100,
  'Too many publish requests, please try again later.'
);

module.exports = {
  apiLimiter,
  strictLimiter,
  publishLimiter
};


