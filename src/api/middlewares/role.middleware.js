const authConfig = require('../../../config/auth.config');
const responseUtil = require('../../utils/response.util');

const roleMiddleware = (allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json(
        responseUtil.error('Authentication required', 401)
      );
    }

    const userRole = req.user.role;

    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json(
        responseUtil.error('Insufficient permissions', 403)
      );
    }

    next();
  };
};

module.exports = roleMiddleware;


