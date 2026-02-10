require('dotenv').config();

module.exports = {
  login: {
    windowMs: parseInt(process.env.LOGIN_RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
    maxAttempts: parseInt(process.env.LOGIN_MAX_ATTEMPTS) || 5,
    lockoutDuration: parseInt(process.env.LOGIN_LOCKOUT_DURATION) || 30 * 60 * 1000, // 30 minutes
    progressiveDelay: process.env.LOGIN_PROGRESSIVE_DELAY === 'true'
  },
  api: {
    windowMs: parseInt(process.env.API_RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
    maxRequests: parseInt(process.env.API_MAX_REQUESTS) || 100,
    authenticatedMaxRequests: parseInt(process.env.API_AUTHENTICATED_MAX_REQUESTS) || 1000
  },
  passwordReset: {
    windowMs: parseInt(process.env.PASSWORD_RESET_WINDOW_MS) || 60 * 60 * 1000, // 1 hour
    maxRequests: parseInt(process.env.PASSWORD_RESET_MAX_REQUESTS) || 3
  },
  mfa: {
    windowMs: parseInt(process.env.MFA_RATE_LIMIT_WINDOW_MS) || 5 * 60 * 1000, // 5 minutes
    maxAttempts: parseInt(process.env.MFA_MAX_ATTEMPTS) || 5
  }
};


