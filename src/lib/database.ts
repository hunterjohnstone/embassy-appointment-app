import { Pool } from 'pg';

// Create a connection pool
const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
  // Add these options for better connection handling
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Test the connection on startup
pool.on('connect', () => {
  console.log('✅ Connected to PostgreSQL database');
});

pool.on('error', (err) => {
  console.error('❌ PostgreSQL pool error:', err);
});

export { pool };