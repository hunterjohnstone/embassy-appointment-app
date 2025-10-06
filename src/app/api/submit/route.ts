/* eslint-disable @typescript-eslint/no-explicit-any */

import { NextResponse } from 'next/server';
import { pool } from '@/lib/database';
// api/submit/route.ts
export async function POST(request: Request) {
  const client = await pool.connect();
  
  try {
    const { email, location = 'windhoek', tier = 'free' } = await request.json();
    
    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Invalid email' }, { status: 400 });
    }

    await client.query(`
      CREATE TABLE IF NOT EXISTS emails (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        location VARCHAR(100) DEFAULT 'windhoek',
        tier VARCHAR(20) DEFAULT 'free' CHECK (tier IN ('free', 'paid')),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);
    
    const result = await client.query(
      `INSERT INTO emails (email, location, tier) 
       VALUES ($1, $2, $3) 
       ON CONFLICT (email) 
       DO UPDATE SET location = $2, tier = $3 
       RETURNING *`,
      [email, location, tier]
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