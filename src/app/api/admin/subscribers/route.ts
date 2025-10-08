/* eslint-disable @typescript-eslint/no-explicit-any */

import { pool } from "@/lib/database";
import { NextResponse } from "next/server";

// In your API route, add this at the beginning:
export async function GET(request: Request) {
  console.log('🔍 Database Connection Debug:');
  console.log('  - POSTGRES_URL:', process.env.POSTGRES_URL ? 'Exists' : 'MISSING');
  
  const client = await pool.connect();
  
  try {
    // Check which database we're actually connected to
    const dbInfo = await client.query(`
      SELECT 
        current_database(),
        current_user,
        version(),
        current_schema()
    `);
    console.log('  - Current Database:', dbInfo.rows[0].current_database);
    console.log('  - Current Schema:', dbInfo.rows[0].current_schema);
    console.log('  - Current User:', dbInfo.rows[0].current_user);
    
    // Check if table exists and get exact column names
    const tableInfo = await client.query(`
      SELECT column_name, data_type, is_nullable 
      FROM information_schema.columns 
      WHERE table_name = 'emails'
      ORDER BY ordinal_position;
    `);
    
    console.log('  - Emails table columns:', tableInfo.rows.map((r: any) => r.column_name));
    console.log('  - Exact column names:', tableInfo.rows);
    
    // If no columns found, list all tables to see what's there
    if (tableInfo.rows.length === 0) {
      const allTables = await client.query(`
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public'
        ORDER BY table_name;
      `);
      console.log('  - All tables in public schema:', allTables.rows);
    }

    // Rest of your API logic...
    const apiKey = request.headers.get('x-api-key');
    const validApiKey = process.env.API_KEY;
    
    if (!apiKey || apiKey !== validApiKey) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const location = searchParams.get('location');
    const tier = searchParams.get('tier');

    // Use the ACTUAL column names from the query above
    const columnNames = tableInfo.rows.map((r: any) => r.column_name);
    console.log('  - Available columns:', columnNames);
    
    // Build query based on actual column names
    let query = 'SELECT ';
    
    // Map to the correct column names
    if (columnNames.includes('email')) {
      query += 'email, ';
    }
    if (columnNames.includes('location')) {
      query += 'location, ';
    } else if (columnNames.includes('embassy')) {
      query += 'embassy as location, ';
    }
    if (columnNames.includes('tier')) {
      query += 'tier, ';
    } else if (columnNames.includes('plan')) {
      query += 'plan as tier, ';
    }
    if (columnNames.includes('created_at')) {
      query += 'created_at ';
    } else {
      query = query.slice(0, -2); // Remove trailing comma
    }
    
    query += 'FROM emails WHERE 1=1';
    
    const params: any[] = [];
    let paramCount = 0;

    if (location) {
      paramCount++;
      // Use the actual location column name
      const locationColumn = columnNames.includes('location') ? 'location' : 'embassy';
      query += ` AND ${locationColumn} = $${paramCount}`;
      params.push(location);
    }

    if (tier) {
      paramCount++;
      // Use the actual tier column name
      const tierColumn = columnNames.includes('tier') ? 'tier' : 'plan';
      query += ` AND ${tierColumn} = $${paramCount}`;
      params.push(tier);
    }

    query += ' ORDER BY created_at DESC';

    console.log('  - Final query:', query);
    console.log('  - Query params:', params);

    const result = await client.query(query, params);
    
    return NextResponse.json({
      success: true,
      subscribers: result.rows,
      count: result.rowCount,
      debug: {
        database: dbInfo.rows[0].current_database,
        actualColumns: columnNames
      }
    });
    
  } catch (error: any) {
    console.error('  ❌ Database error:', error);
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