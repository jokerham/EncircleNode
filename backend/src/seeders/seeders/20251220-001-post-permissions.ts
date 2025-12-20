// ============================================
// backend/src/seeders/seeders/20251220-001-post-permissions.ts
// ============================================
import dotenv from 'dotenv';
import { Role } from '../../models/Role';
import { Permission } from '../../models/Permission';

export const name = '20251220-001-post-permissions';

dotenv.config();

// Post permissions configuration
const postPermissions = [
  {
    resource: 'Post',
    action: 'create',
    scope: 'all',
    description: 'Create new posts'
  },
  {
    resource: 'Post',
    action: 'read',
    scope: 'all',
    description: 'View posts'
  },
  {
    resource: 'Post',
    action: 'update',
    scope: 'all',
    description: 'Update existing posts'
  },
  {
    resource: 'Post',
    action: 'delete',
    scope: 'all',
    description: 'Delete posts'
  }
];

export async function up() {
  console.log('🔧 Creating Post permissions...');

  // Find the Admin role
  const adminRole = await Role.findOne({ name: 'Admin' });
  
  if (!adminRole) {
    throw new Error('Admin role not found. Please run role seeder first.');
  }

  const createdPermissions = [];

  for (const permConfig of postPermissions) {
    // Check if permission already exists
    let permission = await Permission.findOne({
      resource: permConfig.resource,
      action: permConfig.action
    });

    if (!permission) {
      // Create new permission
      permission = await Permission.create({
        resource: permConfig.resource,
        action: permConfig.action,
        scope: permConfig.scope,
        description: permConfig.description
      });
      console.log(`   ✅ Created permission: ${permConfig.resource}:${permConfig.action}`);
      createdPermissions.push(permission);
    } else {
      console.log(`   ℹ️  Permission already exists: ${permConfig.resource}:${permConfig.action}`);
      createdPermissions.push(permission);
    }
  }

  // Add permissions to Admin role if not already assigned
  for (const permission of createdPermissions) {
    if (!adminRole.permissions.includes(permission._id)) {
      adminRole.permissions.push(permission._id);
    }
  }

  await adminRole.save();
  console.log(`✅ All Post permissions assigned to Admin role`);
  console.log(`   Total permissions: ${createdPermissions.length}`);
}

export async function down() {
  console.log('🔧 Removing Post permissions...');

  // Find the Admin role
  const adminRole = await Role.findOne({ name: 'Admin' });
  
  if (!adminRole) {
    console.log('⚠️  Admin role not found');
    return;
  }

  // Find all Post permissions
  const postPermissionDocs = await Permission.find({ resource: 'Post' });
  const permissionIds = postPermissionDocs.map(p => p._id);

  // Remove permissions from Admin role
  adminRole.permissions = adminRole.permissions.filter(
    permId => !permissionIds.some(pid => pid.equals(permId))
  );
  await adminRole.save();
  console.log('✅ Removed Post permissions from Admin role');

  // Delete the permissions
  const result = await Permission.deleteMany({ resource: 'Post' });
  console.log(`✅ Deleted ${result.deletedCount} Post permissions`);
}