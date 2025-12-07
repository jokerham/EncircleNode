// ============================================
// Optional: CLI for seeder management
// backend/src/seeders/cli.ts

import { SeederLog } from '../models/SeederLog';
import connectDB from '../config/database';
import * as fs from 'fs';
import * as path from 'path';

async function listSeeders() {
  const logs = await SeederLog.find().sort({ executedAt: 1 });
  
  console.log('\n📋 Seeder Execution History:\n');
  
  if (logs.length === 0) {
    console.log('   No seeders have been executed yet.');
    return;
  }

  logs.forEach(log => {
    const status = log.status === 'success' ? '✅' : '❌';
    console.log(`${status} ${log.name}`);
    console.log(`   Executed: ${log.executedAt.toLocaleString()}`);
    if (log.error) {
      console.log(`   Error: ${log.error}`);
    }
    console.log('');
  });
}

async function resetSeeder(seederName: string) {
  const result = await SeederLog.deleteOne({ name: seederName });
  
  if (result.deletedCount > 0) {
    console.log(`✅ Reset seeder log: ${seederName}`);
    console.log(`⚠️  Note: This only removes the tracking record.`);
    console.log(`   The actual seeded data is NOT removed.`);
    console.log(`   Use 'rollback' command to undo data changes.`);
  } else {
    console.log(`⚠️  Seeder not found: ${seederName}`);
  }
}

async function rollbackSeeder(seederName: string) {
  // Check if seeder log exists
  const seederLog = await SeederLog.findOne({ name: seederName });
  
  if (!seederLog) {
    console.log(`⚠️  Seeder log not found: ${seederName}`);
    console.log(`   This seeder may not have been executed yet.`);
    return;
  }

  // Load the specific seeder
  const seedersDir = path.join(__dirname, 'seeders');
  
  if (!fs.existsSync(seedersDir)) {
    console.error(`❌ Seeders directory not found: ${seedersDir}`);
    return;
  }

  const files = fs.readdirSync(seedersDir)
    .filter(file => (file.endsWith('.ts') || file.endsWith('.js')) && !file.endsWith('.d.ts') && !file.endsWith('.map'))
    .sort();

  for (const file of files) {
    try {
      const seederPath = path.join(seedersDir, file);
      const seederModule = await import(seederPath);

      if (seederModule.name === seederName) {
        if (typeof seederModule.down === 'function') {
          try {
            console.log(`⬇️  Rolling back ${seederName}...`);
            
            // Execute the down function
            await seederModule.down();
            
            // Delete the seeder log after successful rollback
            await SeederLog.deleteOne({ name: seederName });
            
            console.log(`✅ Rollback successful: ${seederName}`);
          } catch (error) {
            console.error(`❌ Rollback failed:`, error);
            throw error;
          }
        } else {
          console.log(`⚠️  No 'down()' function found in ${seederName}`);
          console.log(`   Cannot rollback. You'll need to manually undo the changes.`);
          console.log(`   You can use 'reset' command to just remove the log entry.`);
        }
        return;
      }
    } catch (error) {
      console.error(`❌ Error loading seeder ${file}:`, error);
    }
  }

  console.log(`⚠️  Seeder file not found: ${seederName}`);
}

async function resetAllSeeders() {
  const result = await SeederLog.deleteMany({});
  console.log(`✅ Reset ${result.deletedCount} seeder logs`);
  console.log(`⚠️  Note: This only removes tracking records.`);
  console.log(`   The actual seeded data is NOT removed.`);
}

async function rollbackAllSeeders() {
  // Get all executed seeders in reverse order
  const seederLogs = await SeederLog.find({ status: 'success' }).sort({ executedAt: -1 });
  
  if (seederLogs.length === 0) {
    console.log('ℹ️  No seeders to rollback.');
    return;
  }

  console.log(`Found ${seederLogs.length} seeder(s) to rollback\n`);

  // Load all seeder modules
  const seedersDir = path.join(__dirname, 'seeders');
  const seederModules = new Map();

  if (fs.existsSync(seedersDir)) {
    const files = fs.readdirSync(seedersDir)
      .filter(file => (file.endsWith('.ts') || file.endsWith('.js')) && !file.endsWith('.d.ts') && !file.endsWith('.map'))
      .sort();

    for (const file of files) {
      try {
        const seederPath = path.join(seedersDir, file);
        const seederModule = await import(seederPath);
        if (seederModule.name) {
          seederModules.set(seederModule.name, seederModule);
        }
      } catch (error) {
        console.error(`❌ Error loading seeder ${file}:`, error);
      }
    }
  }

  let successCount = 0;
  let failedCount = 0;
  let skippedCount = 0;

  // Rollback each seeder in reverse order
  for (const log of seederLogs) {
    const seederModule = seederModules.get(log.name);

    if (!seederModule) {
      console.log(`⚠️  Seeder file not found: ${log.name} (skipping)`);
      skippedCount++;
      continue;
    }

    if (typeof seederModule.down !== 'function') {
      console.log(`⚠️  No 'down()' function in ${log.name} (skipping)`);
      skippedCount++;
      continue;
    }

    try {
      console.log(`⬇️  Rolling back ${log.name}...`);
      await seederModule.down();
      await SeederLog.deleteOne({ name: log.name });
      console.log(`✅ Rollback successful: ${log.name}\n`);
      successCount++;
    } catch (error) {
      console.error(`❌ Rollback failed for ${log.name}:`, error);
      console.log('');
      failedCount++;
      // Continue with other seeders instead of stopping
    }
  }

  console.log('📊 Rollback Summary:');
  console.log(`   ✅ Successful: ${successCount}`);
  console.log(`   ⏭️  Skipped: ${skippedCount}`);
  console.log(`   ❌ Failed: ${failedCount}`);
}

// CLI execution
const command = process.argv[2];
const arg = process.argv[3];

if (require.main === module) {
  connectDB()
    .then(async () => {
      switch (command) {
        case 'list':
          await listSeeders();
          break;
        case 'reset':
          if (arg) {
            await resetSeeder(arg);
          } else {
            console.log('Usage: npm run seed:cli reset <seeder-name>');
          }
          break;
        case 'reset-all':
          await resetAllSeeders();
          break;
        case 'rollback':
          if (arg) {
            await rollbackSeeder(arg);
          } else {
            console.log('Usage: npm run seed:cli rollback <seeder-name>');
          }
          break;
        case 'rollback-all':
          await rollbackAllSeeders();
          break;
        default:
          console.log('Available commands:');
          console.log('  npm run seed:cli list');
          console.log('  npm run seed:cli reset <seeder-name>');
          console.log('  npm run seed:cli reset-all');
          console.log('  npm run seed:cli rollback <seeder-name>');
          console.log('  npm run seed:cli rollback-all');
      }
      process.exit(0);
    })
    .catch((error) => {
      console.error('Error:', error);
      process.exit(1);
    });
}