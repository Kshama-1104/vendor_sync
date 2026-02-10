const jwt = require('jsonwebtoken');
const authConfig = require('../../../config/auth.config');
const responseUtil = require('../../utils/response.util');

const authMiddleware = (req, res, next) => {
  try {
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


