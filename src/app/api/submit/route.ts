/* eslint-disable @typescript-eslint/no-explicit-any */
// api/submit/route.ts

import { NextResponse } from 'next/server';
import { pool } from '@/lib/database';

export async function POST(request: Request) {
  const client = await pool.connect();
  
  try {
    const { email, location = 'windhoek', tier = 'free' } = await request.json();
    
    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Invalid email' }, { status: 400 });
    }

    // SECURITY: Prevent users from setting themselves to 'paid' without payment
    if (tier === 'paid') {
      return NextResponse.json(
        { error: 'Cannot self-assign paid tier. Use Stripe checkout.' },
        { status: 403 }
      );
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
   ON CONFLICT (email)  -- Conflict on email unique constraint
   DO UPDATE SET 
     location = EXCLUDED.location,
     tier = CASE 
       WHEN emails.tier = 'paid' THEN 'paid'  -- Keep existing paid tier
       ELSE EXCLUDED.tier  -- Only allow free tier changes
     END
   RETURNING *`,
  [email, location, 'free']
);
    
    return NextResponse.json({ 
      success: true, 
      message: 'Email submitted successfully',
      inserted: result.rows.length > 0,
      currentTier: result.rows[0].tier
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