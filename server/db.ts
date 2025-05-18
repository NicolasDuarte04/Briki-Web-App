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

// Use a singleton pattern to ensure we only create one database connection
let _pool: Pool | null = null;
let _db: ReturnType<typeof drizzle> | null = null;

// Get the pool instance (create only once)
export const getPool = () => {
  if (!_pool) {
    _pool = new Pool({ 
      connectionString: process.env.DATABASE_URL,
      max: 3, // Reduce max connections to avoid overwhelming the database
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 5000
    });
  }
  return _pool;
};

// Get the db instance (create only once)
export const getDb = () => {
  if (!_db) {
    _db = drizzle({ client: getPool(), schema });
  }
  return _db;
};

// Backward compatibility exports
export const pool = getPool();
export const db = getDb();