/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server';
import { pool } from '@/lib/database';

export async function GET(request: Request) {
  const client = await pool.connect();
  
  try {
    const { searchParams } = new URL(request.url);
    const location = searchParams.get('location');
    const tier = searchParams.get('tier');

    let query = 'SELECT email, location, tier, created_at FROM emails WHERE 1=1';
    const params: any[] = [];
    let paramCount = 0;

    if (location) {
      paramCount++;
      query += ` AND location = $${paramCount}`;
      params.push(location);
    }

    if (tier) {
      paramCount++;
      query += ` AND tier = $${paramCount}`;
      params.push(tier);
    }

    query += ' ORDER BY created_at DESC';

    const result = await client.query(query, params);
    
    return NextResponse.json({
      success: true,
      subscribers: result.rows,
      count: result.rowCount
    });
    
  } catch (error: any) {
    console.error('Database error:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Database operation failed',
        details: error.message
      }, 
      { status: 500 }
    );
  } finally {
    client.release();
  }
}