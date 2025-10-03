import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

// Ensure we're in a server environment
if (typeof window !== 'undefined') {
  throw new Error('Database operations can only be performed on the server');
}

const dbPath = path.join(process.cwd(), 'emails.db');
const db = new Database(dbPath);

// Initialize table
db.exec(`
  CREATE TABLE IF NOT EXISTS emails (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

export { db };