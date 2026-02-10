const rateLimit = require('express-rate-limit');
const rateLimitConfig = require('../../../config/rate-limit.config');

const loginLimiter = rateLimit({
  windowMs: rateLimitConfig.login.windowMs,
  max: rateLimitConfig.login.maxAttempts,
  message: 'Too many login attempts, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 5,
  message: 'Too many registration attempts, please try again later.'
});

const passwordResetLimiter = rateLimit({
  windowMs: rateLimitConfig.passwordReset.windowMs,
  max: rateLimitConfig.passwordReset.maxRequests,
  message: 'Too many password reset requests, please try again later.'
});

const mfaLimiter = rateLimit({
  windowMs: rateLimitConfig.mfa.windowMs,
  max: rateLimitConfig.mfa.maxAttempts,
  message: 'Too many MFA attempts, please try again later.'
});

module.exports = {
  login: loginLimiter,
  register: registerLimiter,
  passwordReset: passwordResetLimiter,
  mfa: mfaLimiter
};


