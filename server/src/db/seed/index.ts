import { connectDb, disconnectDb } from '../../config/db';
import { seedAccounts } from './accounts';
import { seedCatalog } from './catalog';
import { seedPages } from './pages';
import { seedSettings } from './settings';
import { seedTickets } from './tickets';

/**
 * Idempotent seed: every step checks for existing data and skips. Safe to run on every deploy.
 * Order matters only where later steps reference earlier ones.
 */
async function seed(): Promise<void> {
  await connectDb();
  await seedAccounts();
  await seedSettings();
  await seedPages();
  await seedCatalog();
  await seedTickets();
  await disconnectDb();
  console.log('🌱 Seed complete');
}

seed().catch(async (err) => {
  console.error('❌ Seed failed:', err);
  await disconnectDb();
  process.exit(1);
});
