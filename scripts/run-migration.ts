import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { join } from 'path';

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY || '';

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_KEY environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function runMigration() {
  try {
    console.log('Running document summaries migration...');
    
    // Read the migration file
    const migrationPath = join(__dirname, '..', 'migrations', '0010_create_document_summaries.sql');
    const migrationSQL = readFileSync(migrationPath, 'utf-8');
    
    // Execute the migration
    const { error } = await supabase.rpc('exec_sql', {
      sql: migrationSQL
    });
    
    if (error) {
      // If RPC doesn't exist, try direct execution (this might not work with Supabase client)
      console.log('RPC method not available, attempting direct execution...');
      
      // Split by statements and execute individually
      const statements = migrationSQL
        .split(';')
        .map(s => s.trim())
        .filter(s => s.length > 0);
      
      for (const statement of statements) {
        console.log(`Executing: ${statement.substring(0, 50)}...`);
        // Note: This approach might not work with Supabase client library
        // You may need to use a direct PostgreSQL connection or Supabase CLI
      }
      
      console.error('Direct execution not supported. Please run the migration using Supabase CLI or dashboard.');
      console.log('\nMigration SQL has been saved to:', migrationPath);
      console.log('You can run it manually in the Supabase SQL editor.');
      return;
    }
    
    console.log('✅ Migration completed successfully!');
  } catch (error) {
    console.error('Error running migration:', error);
    process.exit(1);
  }
}

runMigration(); 