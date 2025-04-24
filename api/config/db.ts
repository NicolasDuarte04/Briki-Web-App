import pg from 'pg';
import { config } from './config';

// Create a PostgreSQL connection pool
const pool = new pg.Pool({
  connectionString: config.database.url,
});

// Test the database connection
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Database connection error:', err.message);
  } else {
    console.log('Database connected successfully at:', res.rows[0].now);
  }
});

export default pool;