import { sql } from 'drizzle-orm';
import { db } from '../server/db';

// Migration to add missing user profile fields
export async function runMigration() {
  console.log('Starting migration: Adding user profile fields');
  
  try {
    // Check if first_name column exists
    const firstNameExists = await checkColumnExists('users', 'first_name');
    if (!firstNameExists) {
      console.log('Adding first_name column to users table');
      await db.execute(sql`ALTER TABLE users ADD COLUMN first_name TEXT`);
    }
    
    // Check if last_name column exists
    const lastNameExists = await checkColumnExists('users', 'last_name');
    if (!lastNameExists) {
      console.log('Adding last_name column to users table');
      await db.execute(sql`ALTER TABLE users ADD COLUMN last_name TEXT`);
    }
    
    // Check if profile_image_url column exists
    const profileImageExists = await checkColumnExists('users', 'profile_image_url');
    if (!profileImageExists) {
      console.log('Adding profile_image_url column to users table');
      await db.execute(sql`ALTER TABLE users ADD COLUMN profile_image_url TEXT`);
    }
    
    console.log('Migration completed successfully');
    return true;
  } catch (error) {
    console.error('Migration failed:', error);
    throw error;
  }
}

// Helper function to check if a column exists
async function checkColumnExists(tableName: string, columnName: string): Promise<boolean> {
  try {
    const result = await db.execute(sql`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = ${tableName} 
      AND column_name = ${columnName}
    `);
    
    return result.rows.length > 0;
  } catch (error) {
    console.error(`Error checking if column ${columnName} exists:`, error);
    throw error;
  }
}