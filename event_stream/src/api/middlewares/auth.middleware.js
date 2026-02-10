const jwt = require('jsonwebtoken');
const authConfig = require('../../../config/auth.config');
const responseUtil = require('../../utils/response.util');

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json(responseUtil.error('Authentication required', 401));
    }

    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, authConfig.jwt.secret);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json(responseUtil.error('Invalid or expired token', 401));
  }
};

module.exports = authMiddleware;


