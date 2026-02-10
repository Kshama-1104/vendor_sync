module.exports = {
  roles: {
    admin: {
      name: 'Admin',
      description: 'Full system access',
      permissions: [
        '*'
      ]
    },
    manager: {
      name: 'Manager',
      description: 'Team and workspace management',
      permissions: [
        'read:all',
        'write:workspace',
        'manage:team',
        'view:analytics',
        'manage:workflows'
      ]
    },
    user: {
      name: 'User',
      description: 'Standard user access',
      permissions: [
        'read:own',
        'write:own',
        'read:workspace',
        'create:task',
        'update:own_task'
      ]
    }
  },
  workspaceRoles: {
    owner: {
      name: 'Owner',
      permissions: ['*']
    },
    admin: {
      name: 'Admin',
      permissions: [
        'read:all',
        'write:all',
        'manage:members',
        'manage:workflows'
      ]
    },
    member: {
      name: 'Member',
      permissions: [
        'read:all',
        'write:own',
        'create:task'
      ]
    },
    viewer: {
      name: 'Viewer',
      permissions: [
        'read:all'
      ]
    }
  }
};


