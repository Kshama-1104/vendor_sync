const rateLimit = require('express-rate-limit');

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000,
  message: 'Too many requests, please try again later.'
});

const produceLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 100,
  message: 'Too many produce requests, please try again later.'
});

module.exports = {
  apiLimiter,
  produceLimiter
};


