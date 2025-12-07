// ============================================
// backend/src/seeders/seeders/20251207-001-default-roles.ts
import { Role } from '../../models/Role';
import { createDefaultPermissions, Permission, PermissionAction, PermissionScope } from '../../models/Permission';

export const name = '20251207-001-default-roles';

const defaultRolesConfig = [
  {
    name: 'Admin',
    description: 'Full system access - all resources with ALL scope',
    isSystemRole: true,
    permissions: [
      // Full access to User, Permission, Role
      { resource: 'User', action: PermissionAction.CREATE, scope: PermissionScope.ALL },
      { resource: 'User', action: PermissionAction.READ, scope: PermissionScope.ALL },
      { resource: 'User', action: PermissionAction.UPDATE, scope: PermissionScope.ALL },
      { resource: 'User', action: PermissionAction.DELETE, scope: PermissionScope.ALL },
      { resource: 'Permission', action: PermissionAction.CREATE, scope: PermissionScope.ALL },
      { resource: 'Permission', action: PermissionAction.READ, scope: PermissionScope.ALL },
      { resource: 'Permission', action: PermissionAction.UPDATE, scope: PermissionScope.ALL },
      { resource: 'Permission', action: PermissionAction.DELETE, scope: PermissionScope.ALL },
      { resource: 'Role', action: PermissionAction.CREATE, scope: PermissionScope.ALL },
      { resource: 'Role', action: PermissionAction.READ, scope: PermissionScope.ALL },
      { resource: 'Role', action: PermissionAction.UPDATE, scope: PermissionScope.ALL },
      { resource: 'Role', action: PermissionAction.DELETE, scope: PermissionScope.ALL }
    ]
  },
  {
    name: 'Editor',
    description: 'Can create and edit content - ALL scope on Project, Notice, Resource',
    isSystemRole: true,
    permissions: [
      { resource: 'User', action: PermissionAction.READ, scope: PermissionScope.ALL },
      { resource: 'User', action: PermissionAction.UPDATE, scope: PermissionScope.OWN }
    ]
  },
  {
    name: 'Viewer',
    description: 'View-only access - can view all users and read content',
    isSystemRole: true,
    permissions: [
      { resource: 'User', action: PermissionAction.READ, scope: PermissionScope.ALL },
      { resource: 'User', action: PermissionAction.UPDATE, scope: PermissionScope.OWN }
    ]
  },
  {
    name: 'User',
    description: 'Basic user - can only manage own profile and view content',
    isSystemRole: true,
    permissions: [
      { resource: 'User', action: PermissionAction.READ, scope: PermissionScope.ALL },
      { resource: 'User', action: PermissionAction.UPDATE, scope: PermissionScope.OWN }
    ]
  }
];

export async function up() {
  // First, ensure all permissions exist
  await createDefaultPermissions();
  console.log('✅ Default permissions created/verified');

  for (const roleConfig of defaultRolesConfig) {
    const existingRole = await Role.findOne({ name: roleConfig.name });
    
    if (!existingRole) {
      const permissionIds = [];
      
      for (const perm of roleConfig.permissions) {
        const permission = await Permission.findOne({ 
          resource: perm.resource, 
          action: perm.action,
          scope: perm.scope 
        });
        
        if (permission) {
          permissionIds.push(permission._id);
        } else {
          console.warn(`⚠️  Permission not found: ${perm.resource}.${perm.action}.${perm.scope}`);
        }
      }
      
      await Role.create({
        name: roleConfig.name,
        description: roleConfig.description,
        isSystemRole: roleConfig.isSystemRole,
        permissions: permissionIds
      });
      
      console.log(`✅ Created role: ${roleConfig.name} with ${permissionIds.length} permissions`);
    } else {
      console.log(`ℹ️  Role already exists: ${roleConfig.name}`);
    }
  }
  
  console.log('✅ Default roles created/verified');
}

export async function down() {
  // Delete all default roles
  const roleNames = defaultRolesConfig.map(r => r.name);
  
  // Note: This will fail for system roles due to the pre-deleteOne hook
  // We need to temporarily bypass the protection or delete them directly
  const result = await Role.deleteMany({ 
    name: { $in: roleNames },
    isSystemRole: true 
  });
  
  console.log(`✅ Removed ${result.deletedCount} default roles`);
  
  // Note: Permissions are not deleted as they might be used by other roles
  console.log('ℹ️  Permissions were not deleted (may be used by other roles)');
}