import { NextResponse } from 'next/server';
import { pool } from '@/lib/database';

export async function POST(request: Request) {
  const client = await pool.connect();
  
  try {
    const { email } = await request.json();
    
    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Invalid email' }, { status: 400 });
    }

    // Create table if not exists
    await client.query(`
      CREATE TABLE IF NOT EXISTS emails (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);
    
    // Insert email
    const result = await client.query(
      'INSERT INTO emails (email) VALUES ($1) ON CONFLICT (email) DO NOTHING RETURNING *',
      [email]
    );
    
    return NextResponse.json({ 
      success: true, 
      message: 'Email submitted successfully',
      inserted: result.rows.length > 0
    });
    
  } catch (error: any) {
    console.error('Database error:', error);
    return NextResponse.json(
      { 
        error: 'Database operation failed',
        details: error.message
      }, 
      { status: 500 }
    );
  } finally {
    client.release();
  }
}