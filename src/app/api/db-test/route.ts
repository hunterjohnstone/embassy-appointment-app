import { NextResponse } from 'next/server';
import { pool } from '@/lib/database';

export async function GET() {
  const client = await pool.connect();
  
  try {
    // Test the connection with a simple query
    const result = await client.query('SELECT version(), current_timestamp as server_time');
    
    // Check if our table exists and get count
    const tableCheck = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'emails'
      ) as table_exists
    `);
    
    let emailCount = 0;
    if (tableCheck.rows[0].table_exists) {
      const countResult = await client.query('SELECT COUNT(*) as count FROM emails');
      emailCount = parseInt(countResult.rows[0].count);
    }
    
    return NextResponse.json({ 
      success: true,
      message: 'Database connection successful!',
      postgres_version: result.rows[0].version,
      server_time: result.rows[0].server_time,
      table_exists: tableCheck.rows[0].table_exists,
      email_count: emailCount,
      connection_info: 'Using regular pg client'
    });
    
  } catch (error: any) {
    console.error('Database connection error:', error);
    return NextResponse.json({ 
      success: false,
      error: 'Database connection failed',
      details: error.message,
      connection_string: process.env.POSTGRES_URL ? 'Environment variable found' : 'No POSTGRES_URL found',
      hint: 'Make sure PostgreSQL is running and POSTGRES_URL is correct in .env.local'
    }, { status: 500 });
  } finally {
    client.release();
  }
}