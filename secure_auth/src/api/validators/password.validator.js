const authConfig = require('../../../config/auth.config');

const validate = (password) => {
  if (password.length < authConfig.password.minLength) {
    throw new Error(`Password must be at least ${authConfig.password.minLength} characters long`);
  }

  if (authConfig.password.requireUppercase && !/[A-Z]/.test(password)) {
    throw new Error('Password must contain at least one uppercase letter');
  }

  if (authConfig.password.requireLowercase && !/[a-z]/.test(password)) {
    throw new Error('Password must contain at least one lowercase letter');
  }

  if (authConfig.password.requireNumbers && !/\d/.test(password)) {
    throw new Error('Password must contain at least one number');
  }

  if (authConfig.password.requireSpecialChars && !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    throw new Error('Password must contain at least one special character');
  }

  return true;
};

module.exports = { validate };


