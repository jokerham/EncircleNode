import mongoose, { Document, Schema } from 'mongoose';
import { createDefaultPermissions, IPermission, Permission, PermissionAction, PermissionScope } from './Permission';

// Role interface
export interface IRole extends Document {
  name: string;
  description?: string;
  permissions: mongoose.Types.ObjectId[];
  isSystemRole: boolean; // Prevent deletion of system roles
  createdAt: Date;
  updatedAt: Date;
}

const RoleSchema: Schema = new Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String },
  permissions: [{
    type: Schema.Types.ObjectId,
    ref: 'Permission'
  }],
  isSystemRole: { type: Boolean, default: false },
  effectiveFrom: { type: Date, default: Date.now },
  effectiveTo: { type: Date },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
}, { timestamps: true });

// Prevent deletion of system roles
RoleSchema.pre('deleteOne', async function() {
  const docToDelete = await this.model.findOne(this.getQuery());
  if (docToDelete && docToDelete.isSystemRole) {
    throw new Error('Cannot delete system role');
  }
});

RoleSchema.pre('save', function() {
  this.updatedAt = new Date();
});

// RoleSchema.index({ name: 1 });

export const Role = mongoose.model<IRole>('Role', RoleSchema);

// Helper function to create default roles
export async function createDefaultRoles() { // First, ensure all permissions exist
  await createDefaultPermissions();
  
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
}