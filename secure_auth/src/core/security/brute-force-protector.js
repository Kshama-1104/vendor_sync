const logger = require('../logger');
const rateLimitConfig = require('../../../config/rate-limit.config');

class BruteForceProtector {
  constructor() {
    this.attempts = new Map();
  }

  async check(email, ip) {
    const key = `${email}:${ip}`;
    const attempts = this.attempts.get(key) || { count: 0, lockedUntil: null };

    if (attempts.lockedUntil && new Date(attempts.lockedUntil) > new Date()) {
      const remaining = Math.ceil((new Date(attempts.lockedUntil) - new Date()) / 1000 / 60);
      throw new Error(`Account locked. Try again in ${remaining} minutes.`);
    }

    if (attempts.count >= rateLimitConfig.login.maxAttempts) {
      attempts.lockedUntil = new Date(Date.now() + rateLimitConfig.login.lockoutDuration);
      this.attempts.set(key, attempts);
      throw new Error('Too many failed attempts. Account locked.');
    }
  }

  async recordFailure(email, ip) {
    const key = `${email}:${ip}`;
    const attempts = this.attempts.get(key) || { count: 0, lockedUntil: null };
    attempts.count++;
    this.attempts.set(key, attempts);
    logger.warn(`Failed login attempt: ${email} from ${ip}`);
  }

  async recordSuccess(email, ip) {
    const key = `${email}:${ip}`;
    this.attempts.delete(key);
  }
}

module.exports = new BruteForceProtector();


