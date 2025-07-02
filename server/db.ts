import { Pool } from 'pg';
import { drizzle, NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from "../shared/schema";

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

// Create a global singleton for database connections
let _dbInstance: {
  pool: Pool;
  db: NodePgDatabase<typeof schema>;
} | null = null;

// Initialize database connection (called once during app startup)
export const initializeDb = async (retries = 3, retryDelay = 5000): Promise<{
  pool: Pool;
  db: NodePgDatabase<typeof schema>;
} | null> => {
  if (_dbInstance) {
    return _dbInstance;
  }
  
  let lastError: Error | null = null;
  
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      console.log(`Initializing database connection pool (attempt ${attempt}/${retries})...`);
    
    const pool = new Pool({ 
      connectionString: process.env.DATABASE_URL,
      max: 2, // Limit concurrent connections
      idleTimeoutMillis: 30000, // Close idle connections after 30 seconds
        connectionTimeoutMillis: 15000, // 15 second timeout for connections
        ssl: process.env.DATABASE_URL?.includes('render.com') ? {
          rejectUnauthorized: false // Required for Render PostgreSQL
        } : undefined,
    });
    
    // Test pool connection once to catch early errors
    pool.on('error', (err) => {
      console.error('Unexpected database pool error:', err);
    });
    
      // Test the connection
      const client = await pool.connect();
      await client.query('SELECT 1');
      client.release();
      
      console.log('Database connection test successful');
      
      const db = drizzle(pool, { schema });
    
    _dbInstance = { pool, db };
      return _dbInstance;
    } catch (error) {
      lastError = error as Error;
      console.error(`Database connection attempt ${attempt} failed:`, error);
      
      if (attempt < retries) {
        console.log(`Retrying in ${retryDelay / 1000} seconds...`);
        await new Promise(resolve => setTimeout(resolve, retryDelay));
      }
    }
  }
  
  console.error('Failed to establish database connection after all retries:', lastError);
  // Return null instead of throwing to prevent server crash
  return null;
};

// Get existing database instance or initialize
export const getDatabaseInstance = async () => {
  if (!_dbInstance) {
    return await initializeDb();
  }
  return _dbInstance;
};

// Simplified exports for backward compatibility with lazy initialization
export const pool = new Proxy({} as Pool, {
  get(target, prop, receiver) {
    const instance = _dbInstance;
    if (!instance) {
      throw new Error('Database not initialized. Connection may have failed.');
    }
    return Reflect.get(instance.pool, prop, receiver);
  }
});

export const db = new Proxy({} as NodePgDatabase<typeof schema>, {
  get(target, prop, receiver) {
    const instance = _dbInstance;
    if (!instance) {
      throw new Error('Database not initialized. Connection may have failed.');
    }
    return Reflect.get(instance.db, prop, receiver);
  }
});

// Function to properly close database connections
export const closeDatabase = async () => {
  if (_dbInstance) {
    await _dbInstance.pool.end();
    _dbInstance = null;
    console.log('Database connections closed');
  }
};