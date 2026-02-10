const responseUtil = require('../../utils/response.util');

/**
 * Role-based access control middleware
 * @param {Array} allowedRoles - Array of roles that are allowed to access the route
 */
const roleMiddleware = (allowedRoles) => {
  return (req, res, next) => {
    try {
      // Check if user is authenticated
      if (!req.user) {
        return res.status(401).json(
          responseUtil.error('Authentication required', 401, { code: 'UNAUTHORIZED' })
        );
      }

      const userRole = req.user.role;

      // If user has API key, default to 'producer' role if not specified
      if (!userRole && req.user.apiKey) {
        req.user.role = 'producer';
      }

      // Check if user role is in allowed roles
      if (!allowedRoles.includes(req.user.role)) {
        return res.status(403).json(
          responseUtil.error('Access denied. Insufficient permissions.', 403, { 
            code: 'FORBIDDEN',
            requiredRoles: allowedRoles,
            userRole: req.user.role
          })
        );
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

module.exports = roleMiddleware;
