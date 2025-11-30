import mongoose, { Document, Schema } from 'mongoose';

// Define permission actions
export enum PermissionAction {
  CREATE = 'create',
  READ = 'read',
  UPDATE = 'update',
  DELETE = 'delete'
}

// Define permission scope
export enum PermissionScope {
  ALL = 'all',        // Full access to all records
  OWN = 'own',        // Access only to own records
  NONE = 'none'       // No access
}

// Permission structure for a specific resource/model
export interface IPermission extends Document {
  resource: string;           // e.g., 'User', 'Project', 'Notice', 'Resource'
  action: PermissionAction;   // e.g., 'create', 'read', 'update', 'delete'
  scope: PermissionScope;     // e.g., 'all', 'own', 'none'
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

const PermissionSchema: Schema = new Schema({
  resource: {
    type: String,
    required: [true, 'Resource is required'],
    trim: true
  },
  action: {
    type: String,
    enum: Object.values(PermissionAction),
    required: [true, 'Action is required']
  },
  scope: {
    type: String,
    enum: Object.values(PermissionScope),
    required: [true, 'Scope is required'],
    default: PermissionScope.NONE
  },
  description: {
    type: String,
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Compound unique index to prevent duplicate resource-action-scope combinations
PermissionSchema.index({ resource: 1, action: 1, scope: 1 }, { unique: true });


PermissionSchema.pre('save', function() {
  this.updatedAt = new Date();
});


export const Permission = mongoose.model<IPermission>('Permission', PermissionSchema);

// Helper function to create default permissions
export async function createDefaultPermissions() {
  const permissionsToCreate = [
    // 1. Full access to User (Admin)
    { resource: 'User', action: PermissionAction.CREATE, scope: PermissionScope.ALL, description: 'Create any user' },
    { resource: 'User', action: PermissionAction.READ, scope: PermissionScope.ALL, description: 'Read any user' },
    { resource: 'User', action: PermissionAction.UPDATE, scope: PermissionScope.ALL, description: 'Update any user' },
    { resource: 'User', action: PermissionAction.DELETE, scope: PermissionScope.ALL, description: 'Delete any user' },
    
    // 2. Full access to Permission (Admin)
    { resource: 'Permission', action: PermissionAction.CREATE, scope: PermissionScope.ALL, description: 'Create permissions' },
    { resource: 'Permission', action: PermissionAction.READ, scope: PermissionScope.ALL, description: 'Read permissions' },
    { resource: 'Permission', action: PermissionAction.UPDATE, scope: PermissionScope.ALL, description: 'Update permissions' },
    { resource: 'Permission', action: PermissionAction.DELETE, scope: PermissionScope.ALL, description: 'Delete permissions' },
    
    // 3. Full access to Role (Admin)
    { resource: 'Role', action: PermissionAction.CREATE, scope: PermissionScope.ALL, description: 'Create roles' },
    { resource: 'Role', action: PermissionAction.READ, scope: PermissionScope.ALL, description: 'Read roles' },
    { resource: 'Role', action: PermissionAction.UPDATE, scope: PermissionScope.ALL, description: 'Update roles' },
    { resource: 'Role', action: PermissionAction.DELETE, scope: PermissionScope.ALL, description: 'Delete roles' },
    
    // 4. View access of User (Viewer)
    { resource: 'User', action: PermissionAction.READ, scope: PermissionScope.ALL, description: 'View all users' },
    
    // 5. Full access only for own user (Self-management)
    { resource: 'User', action: PermissionAction.READ, scope: PermissionScope.OWN, description: 'Read own profile' },
    { resource: 'User', action: PermissionAction.UPDATE, scope: PermissionScope.OWN, description: 'Update own profile' },
    { resource: 'User', action: PermissionAction.DELETE, scope: PermissionScope.OWN, description: 'Delete own account' },
  ];

  const createdPermissions = [];
  
  for (const permData of permissionsToCreate) {
    const existingPermission = await Permission.findOne({ 
      resource: permData.resource, 
      action: permData.action,
      scope: permData.scope 
    });
    
    if (!existingPermission) {
      const permission = await Permission.create(permData);
      createdPermissions.push(permission);
      console.log(`✅ Created permission: ${permData.resource}.${permData.action}.${permData.scope}`);
    } else {
      createdPermissions.push(existingPermission);
    }
  }
  
  return createdPermissions;
}