import { NextResponse } from 'next/server';
import { openDb } from '../../../../lib/database';

export async function GET() {
  try {
    const db = await openDb();
    const navigation = await db.all(
      'SELECT * FROM navigation ORDER BY order_index ASC'
    );
    return NextResponse.json(navigation);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch navigation' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const { title, url, order_index, is_active } = await request.json();
    const db = await openDb();
    
    const result = await db.run(
      'INSERT INTO navigation (title, url, order_index, is_active) VALUES (?, ?, ?, ?)',
      [title, url, order_index || 0, is_active !== false]
    );

    return NextResponse.json({ id: result.lastID, message: 'Navigation item created' });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create navigation item' },
      { status: 500 }
    );
  }
}