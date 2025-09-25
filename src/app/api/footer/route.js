import { NextResponse } from 'next/server';
import { openDb } from '../../../../lib/database';

export async function GET() {
  try {
    const db = await openDb();
    const footerItems = await db.all(
      'SELECT * FROM footer_items ORDER BY section ASC, order_index ASC'
    );
    return NextResponse.json(footerItems);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch footer items' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const { section, title, content, url, icon, order_index, is_active } = await request.json();
    const db = await openDb();
    
    const result = await db.run(
      'INSERT INTO footer_items (section, title, content, url, icon, order_index, is_active) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [section, title, content, url, icon, order_index || 0, is_active !== false]
    );

    return NextResponse.json({ id: result.lastID, message: 'Footer item created' });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create footer item' },
      { status: 500 }
    );
  }
}