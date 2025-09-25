import { NextResponse } from 'next/server';
import { openDb } from '../../../../lib/database';

export async function GET() {
  try {
    const db = await openDb();
    const givingContent = await db.all(
      'SELECT * FROM giving_content ORDER BY order_index ASC'
    );
    return NextResponse.json(givingContent);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch giving content' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const { section, title, content, image_url, button_text, button_url, order_index, is_active } = await request.json();
    const db = await openDb();
    
    const result = await db.run(
      'INSERT INTO giving_content (section, title, content, image_url, button_text, button_url, order_index, is_active) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [section, title, content, image_url, button_text, button_url, order_index || 0, is_active !== false]
    );

    return NextResponse.json({ id: result.lastID, message: 'Giving content created' });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create giving content' },
      { status: 500 }
    );
  }
}