const authConfig = require('../../../config/auth.config');

class AccessControl {
  hasPermission(userRole, permission) {
    const rolePermissions = authConfig.roles[userRole] || [];
    
    // Admin has all permissions
    if (rolePermissions.includes('*')) {
      return true;
    }

    // Check specific permission
    return rolePermissions.includes(permission);
  }

  canAccessResource(userRole, resource, action) {
    const permission = `${action}:${resource}`;
    return this.hasPermission(userRole, permission);
  }

  canAccessOwnResource(userRole, resource, action, userId, resourceUserId) {
    // Admin can access all
    if (this.hasPermission(userRole, '*')) {
      return true;
    }

    // Check if user owns the resource
    if (userId === resourceUserId) {
      return this.hasPermission(userRole, `${action}:own`);
    }

    // Check for all access
    return this.hasPermission(userRole, `${action}:all`);
  }

  getRolePermissions(role) {
    return authConfig.roles[role] || [];
  }

  isVendorAccess(userRole, vendorId, resourceVendorId) {
    // Admin and operators can access all vendors
    if (['admin', 'operator'].includes(userRole)) {
      return true;
    }

    // Vendor can only access their own resources
    if (userRole === 'vendor') {
      return vendorId === resourceVendorId;
    }

    return false;
  }
}

module.exports = new AccessControl();


