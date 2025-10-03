import { NextResponse } from 'next/server';
import Database from 'better-sqlite3';
import path from 'path';

export async function POST(request: Request) {
  try {
    const { email } = await request.json();
    
    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Invalid email' }, { status: 400 });
    }

    // Database operations
    const dbPath = path.join(process.cwd(), 'emails.db');
    const db = new Database(dbPath);
    
    // Ensure table exists
    db.exec(`
      CREATE TABLE IF NOT EXISTS emails (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    const stmt = db.prepare('INSERT OR IGNORE INTO emails (email) VALUES (?)');
    const result = stmt.run(email);
    
    db.close();
    
    return NextResponse.json({ 
      success: true, 
      message: 'Email submitted successfully' 
    });
    
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    );
  }
}