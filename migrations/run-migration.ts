import { runMigration } from './add_user_profile_fields';

// Execute the migration
async function executeMigration() {
  try {
    await runMigration();
    console.log('Migration completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

executeMigration();