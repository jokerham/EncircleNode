import { SeederLog } from '../models/SeederLog';
import connectDB from '../config/database';
import * as fs from 'fs';
import * as path from 'path';

// Define seeder interface
interface Seeder {
  name: string;
  up: () => Promise<void>;
}

// Dynamically load all seeders from the seeders directory
async function loadSeeders(): Promise<Seeder[]> {
  const seedersDir = path.join(__dirname, 'seeders');
  const seeders: Seeder[] = [];

  // Check if directory exists
  if (!fs.existsSync(seedersDir)) {
    console.warn(`⚠️  Seeders directory not found: ${seedersDir}`);
    return seeders;
  }

  // Read all files in the seeders directory
  const files = fs.readdirSync(seedersDir)
    .filter(file => {
      // Filter for .ts or .js files, exclude .map and .d.ts files
      return (file.endsWith('.ts') || file.endsWith('.js')) 
        && !file.endsWith('.d.ts') 
        && !file.endsWith('.map');
    })
    .sort(); // Sort to ensure consistent execution order

  // Load each seeder module
  for (const file of files) {
    try {
      const seederPath = path.join(seedersDir, file);
      const seederModule = await import(seederPath);

      // Validate seeder structure
      if (!seederModule.name || typeof seederModule.up !== 'function') {
        console.warn(`⚠️  Invalid seeder file ${file}: missing 'name' or 'up' export`);
        continue;
      }

      seeders.push({
        name: seederModule.name,
        up: seederModule.up
      });

      console.log(`📥 Loaded seeder: ${seederModule.name}`);
    } catch (error) {
      console.error(`❌ Error loading seeder ${file}:`, error);
    }
  }

  return seeders;
}

async function hasBeenExecuted(seederName: string): Promise<boolean> {
  const log = await SeederLog.findOne({ 
    name: seederName, 
    status: 'success' 
  });
  return !!log;
}

async function markAsExecuted(seederName: string, success: boolean, error?: string) {
  await SeederLog.findOneAndUpdate(
    { name: seederName },
    {
      name: seederName,
      executedAt: new Date(),
      status: success ? 'success' : 'failed',
      error: error
    },
    { upsert: true }
  );
}

export async function seedDatabase() {
  try {
    console.log('🌱 Starting incremental database seeding...\n');

    let executed = 0;
    let skipped = 0;
    let failed = 0;

    const seeders = await loadSeeders();

    for (const seeder of seeders) {
      const alreadyExecuted = await hasBeenExecuted(seeder.name);

      if (alreadyExecuted) {
        console.log(`⏭️  Skipping ${seeder.name} (already executed)`);
        skipped++;
        continue;
      }

      try {
        console.log(`▶️  Running ${seeder.name}...`);
        await seeder.up();
        await markAsExecuted(seeder.name, true);
        executed++;
      } catch (error) {
        console.error(`❌ Failed to execute ${seeder.name}:`, error);
        await markAsExecuted(seeder.name, false, error instanceof Error ? error.message : String(error));
        failed++;
        // Optionally, you can choose to stop on first failure:
        // throw error;
      }
      
      console.log('');
    }

    console.log('📊 Seeding Summary:');
    console.log(`   ✅ Executed: ${executed}`);
    console.log(`   ⏭️  Skipped: ${skipped}`);
    console.log(`   ❌ Failed: ${failed}`);
    console.log('\n✅ Database seeding completed!');
  } catch (error) {
    console.error('❌ Error during seeding:', error);
    throw error;
  }
}

// Standalone execution
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
