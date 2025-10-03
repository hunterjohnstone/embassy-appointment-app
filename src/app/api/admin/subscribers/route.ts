/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server';
import { pool } from '@/lib/database';

export async function GET(request: Request) {
  const client = await pool.connect();
  
  try {
    // Get all verified emails (you might want to add a 'verified' column later)
    const result = await client.query(`
      SELECT email 
      FROM emails 
      ORDER BY created_at DESC
    `);
    
    return NextResponse.json({ 
      success: true, 
      subscribers: result.rows.map(row => row.email),
      count: result.rows.length
    });
    
  } catch (error: any) {
    console.error('Database error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch subscribers' }, 
      { status: 500 }
    );
  } finally {
    client.release();
  }
}