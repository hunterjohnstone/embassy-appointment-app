/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server';
import { pool } from '@/lib/database';

export async function POST(request: Request) {
  const client = await pool.connect();
  
  try {
    const { email } = await request.json();
    
    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Invalid email' }, { status: 400 });
    }

    // Delete the email from the database
    const result = await client.query(
      'DELETE FROM emails WHERE email = $1 RETURNING *',
      [email]
    );
    
    return NextResponse.json({ 
      success: true, 
      message: 'Email unsubscribed successfully',
      deleted: result.rows.length > 0
    });
    
  } catch (error: any) {
    console.error('Database error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to unsubscribe',
        details: error.message
      }, 
      { status: 500 }
    );
  } finally {
    client.release();
  }
}