const responseUtil = require('../../utils/response.util');

const permissionMiddleware = (permission) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json(responseUtil.error('Authentication required', 401));
    }

    const userPermissions = req.user.permissions || [];
    if (!userPermissions.includes(permission) && !userPermissions.includes('*')) {
      return res.status(403).json(responseUtil.error('Insufficient permissions', 403));
    }

    next();
  };
};

module.exports = permissionMiddleware;


