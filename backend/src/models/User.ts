// ============================================
// backend/src/models/User.ts
import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcrypt';
import { IRole } from './Role';
import { IPermission, PermissionAction, PermissionScope } from './Permission';
import { Role } from './Role';

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  roleId: mongoose.Types.ObjectId;
  role?: IRole; // Populated role
  isActive: boolean;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
  
  // Methods
  comparePassword(candidatePassword: string): Promise<boolean>;
  hasPermission(resource: string, action: PermissionAction, resourceOwnerId?: string): Promise<boolean>;
  getPermissions(): Promise<IPermission[]>;
}

const UserSchema: Schema = new Schema({
  name: { 
    type: String, 
    required: [true, 'Name is required'],
    trim: true,
    minlength: [2, 'Name must be at least 2 characters long']
  },
  email: { 
    type: String, 
    required: [true, 'Email is required'], 
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters long'],
    select: false
  },
  roleId: {
    type: Schema.Types.ObjectId,
    ref: 'Role',
    required: [true, 'Role is required']
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: {
    type: Date
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

// Pre-save middleware to hash password
UserSchema.pre('save', async function() {
  if (!this.isModified('password')) return;
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password as string, salt);
  } catch (error: any) {
    throw error;
  }
});

UserSchema.pre('save', function() {
  this.updatedAt = new Date();
});

// Method to compare password for login
UserSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    return false;
  }
};

// Method to get all permissions for the user
UserSchema.methods.getPermissions = async function(): Promise<IPermission[]> {
  // Check if roleId is already populated (it's an object, not just an ID)
  if (this.roleId && typeof this.roleId === 'object' && 'permissions' in this.roleId) {
    return (this.roleId as any).permissions;
  }
  
  // Otherwise, fetch the role
  const role = await Role.findById(this.roleId).populate('permissions');
  if (!role) {
    return [];
  }
  
  return role.permissions as unknown as IPermission[];
};

// Enhanced method to check if user has specific permission with scope awareness
UserSchema.methods.hasPermission = async function(
  resource: string, 
  action: PermissionAction,
  resourceOwnerId?: string
): Promise<boolean> {
  const role = await Role.findById(this.roleId).populate('permissions');
  
  if (!role) {
    return false;
  }
  
  const permissions = role.permissions as unknown as IPermission[];
  
  // Check for ALL scope permission (highest level)
  const hasAllScope = permissions.some(
    p => p.resource.toLowerCase() === resource.toLowerCase() 
      && p.action === action 
      && p.scope === PermissionScope.ALL
  );
  
  if (hasAllScope) {
    return true;
  }
  
  // If resourceOwnerId is provided, check for OWN scope permission
  if (resourceOwnerId) {
    const hasOwnScope = permissions.some(
      p => p.resource.toLowerCase() === resource.toLowerCase() 
        && p.action === action 
        && p.scope === PermissionScope.OWN
    );
    
    // User can access if they have OWN permission AND they are the owner
    if (hasOwnScope && this._id.toString() === resourceOwnerId.toString()) {
      return true;
    }
  }
  
  return false;
};

UserSchema.index({ roleId: 1 });

interface IUserModel extends mongoose.Model<IUser> {
  signUp(userData: {
    name: string;
    email: string;
    password: string;
    roleId: string | mongoose.Types.ObjectId;
  }): Promise<IUser>;
  
  signIn(email: string, password: string): Promise<IUser>;
}

export const User = mongoose.model<IUser, IUserModel>('User', UserSchema);
