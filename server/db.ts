import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";

neonConfig.webSocketConstructor = ws;

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

// Create a global singleton for database connections
let _dbInstance: {
  pool: Pool;
  db: ReturnType<typeof drizzle>;
} | null = null;

// Initialize database connection (called once during app startup)
export const initializeDb = () => {
  if (!_dbInstance) {
    console.log('Initializing database connection pool...');
    
    const pool = new Pool({ 
      connectionString: process.env.DATABASE_URL,
      max: 2, // Limit concurrent connections
      idleTimeoutMillis: 30000, // Close idle connections after 30 seconds
      connectionTimeoutMillis: 15000, // Increased from 5s to 15s for Neon cold start
      allowExitOnIdle: true, // Allow pool to cleanup on idle
      ssl: {
        rejectUnauthorized: false, // Accept self-signed / Neon certificates
      },
    });
    
    // Test pool connection once to catch early errors
    pool.on('error', (err) => {
      console.error('Unexpected database pool error:', err);
    });
    
    const db = drizzle({ client: pool, schema });
    
    _dbInstance = { pool, db };
  }
  
  return _dbInstance;
};

// Get existing database instance or initialize
export const getDatabaseInstance = () => {
  if (!_dbInstance) {
    return initializeDb();
  }
  return _dbInstance;
};

// Simplified exports for backward compatibility
export const pool = getDatabaseInstance().pool;
export const db = getDatabaseInstance().db;

// Function to properly close database connections
export const closeDatabase = async () => {
  if (_dbInstance) {
    await _dbInstance.pool.end();
    _dbInstance = null;
    console.log('Database connections closed');
  }
};