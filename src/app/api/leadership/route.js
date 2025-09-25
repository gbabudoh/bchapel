import { NextResponse } from 'next/server';
import { openDb } from '../../../../lib/database';

export async function GET() {
  try {
    const db = await openDb();
    const leadership = await db.all(
      'SELECT * FROM leadership ORDER BY order_index ASC'
    );
    return NextResponse.json(leadership);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch leadership' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const { name, position, bio, image_url, order_index, is_active } = await request.json();
    const db = await openDb();
    
    const result = await db.run(
      'INSERT INTO leadership (name, position, bio, image_url, order_index, is_active) VALUES (?, ?, ?, ?, ?, ?)',
      [name, position, bio, image_url, order_index || 0, is_active !== false]
    );

    return NextResponse.json({ id: result.lastID, message: 'Leader created' });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create leader' },
      { status: 500 }
    );
  }
}