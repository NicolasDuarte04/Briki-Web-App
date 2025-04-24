import { Pool } from 'pg';
import { config } from './config';

// Create a new PostgreSQL pool with appropriate SSL configuration
const pool = new Pool({
  connectionString: config.database.url,
  ...(config.database.ssl && { 
    ssl: { rejectUnauthorized: false } 
  })
});

// Test database connection
pool.connect()
  .then(client => {
    console.log('✅ Successfully connected to PostgreSQL database');
    client.release();
  })
  .catch(err => {
    console.error('❌ Error connecting to PostgreSQL database:', err);
  });

export default pool;