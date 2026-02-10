const jwt = require('jsonwebtoken');
const authConfig = require('../../../config/auth.config');
const responseUtil = require('../../utils/response.util');

// Demo API keys for different roles
const API_KEYS = {
  'demo-api-key': { role: 'admin', name: 'Demo Admin' },
  'admin-api-key': { role: 'admin', name: 'Admin User' },
  'operator-api-key': { role: 'operator', name: 'Operator User' },
  'producer-api-key': { role: 'producer', name: 'Producer User' },
  'consumer-api-key': { role: 'consumer', name: 'Consumer User' }
};

const authMiddleware = (req, res, next) => {
  try {
    // Check for API key first
    const apiKey = req.headers['x-api-key'];
    if (apiKey) {
      // Validate API key
      const keyInfo = API_KEYS[apiKey];
      if (keyInfo) {
        req.user = { apiKey, role: keyInfo.role, name: keyInfo.name };
        return next();
      }
      // Unknown API key - default to producer role
      req.user = { apiKey, role: 'producer' };
      return next();
    }

    // Check for JWT token
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json(
        responseUtil.error('Authentication required', 401)
      );
    }

    const token = authHeader.substring(7);

    try {
      const decoded = jwt.verify(token, authConfig.jwt.secret);
      req.user = decoded;
      next();
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        return res.status(401).json(
          responseUtil.error('Token expired', 401)
        );
      }
      return res.status(401).json(
        responseUtil.error('Invalid token', 401)
      );
    }
  } catch (error) {
    next(error);
  }
};

module.exports = authMiddleware;


