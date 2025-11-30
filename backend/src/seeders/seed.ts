// backend/src/seeders/seed.ts
import { User } from '../models/User';
import { PermissionAction } from '../models/Permission';
import { Role, createDefaultRoles } from '../models/Role';
import connectDB from '../config/database';

export async function seedDatabase() {
  try {
    console.log('🌱 Starting database seeding...');

    // 1. Create default roles
    await createDefaultRoles();
    console.log('✅ Default roles created/verified');

    // 2. Create default admin user if not exists
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@encircle.com';
    const existingAdmin = await User.findOne({ email: adminEmail });

    if (!existingAdmin) {
      const adminRole = await Role.findOne({ name: 'Admin' });
      
      if (!adminRole) {
        throw new Error('Admin role not found. Cannot create admin user.');
      }

      await User.signUp({
        name: process.env.ADMIN_NAME || 'System Administrator',
        email: adminEmail,
        password: process.env.ADMIN_PASSWORD || 'Admin@123',
        roleId: adminRole._id
      });

      console.log('✅ Default admin user created');
      console.log(`   Email: ${adminEmail}`);
      console.log(`   Password: ${process.env.ADMIN_PASSWORD || 'Admin@123'}`);
      console.log('   ⚠️  IMPORTANT: Change the default password immediately!');
    } else {
      console.log('ℹ️  Admin user already exists, skipping...');
    }

    console.log('✅ Database seeding completed successfully!');
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  }
}

// Standalone execution (can run separately: npm run seed)
if (require.main === module) {
  connectDB()
    .then(() => seedDatabase())
    .then(() => {
      console.log('🎉 Seeding complete. Exiting...');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Seeding failed:', error);
      process.exit(1);
    });
}