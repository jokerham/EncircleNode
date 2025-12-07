// ============================================
// backend/src/seeders/seeders/20251207-002-admin-user.ts
import { User } from '../../models/User';
import { Role } from '../../models/Role';
import bcrypt from 'bcrypt';

export const name = '20251207-002-admin-user';

// Admin user configuration
const adminConfig = {
  email: process.env.ADMIN_EMAIL || 'admin@encircle.com',
  name: process.env.ADMIN_NAME || 'System Administrator',
  password: process.env.ADMIN_PASSWORD || 'Admin@123'
};

export async function up() {
  const existingAdmin = await User.findOne({ email: adminConfig.email });

  if (!existingAdmin) {
    const adminRole = await Role.findOne({ name: 'Admin' });
    
    if (!adminRole) {
      throw new Error('Admin role not found. Cannot create admin user. Please run role seeder first.');
    }

    // Create admin user directly (bypassing signUp to avoid duplicate logic)
    const hashedPassword = await bcrypt.hash(adminConfig.password, 10);
    
    const adminUser = await User.create({
      name: adminConfig.name,
      email: adminConfig.email,
      password: hashedPassword,
      roleId: adminRole._id,
      isActive: true
    });

    console.log('✅ Default admin user created');
    console.log(`   Email: ${adminConfig.email}`);
    console.log(`   Password: ${adminConfig.password}`);
    console.log('   ⚠️  IMPORTANT: Change the default password immediately!');
  } else {
    console.log('ℹ️  Admin user already exists, skipping...');
  }
}

export async function down() {
  const result = await User.deleteOne({ email: adminConfig.email });
  
  if (result.deletedCount > 0) {
    console.log(`✅ Removed admin user: ${adminConfig.email}`);
  } else {
    console.log(`ℹ️  Admin user not found: ${adminConfig.email}`);
  }
}