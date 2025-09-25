import { NextResponse } from 'next/server';
import { openDb } from '../../../../lib/database';

export async function GET() {
  try {
    const db = await openDb();
    const content = await db.all(
      'SELECT * FROM homepage_content ORDER BY order_index ASC'
    );
    return NextResponse.json(content);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch homepage content' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const { section, title, content, image_url, button_text, button_url, order_index, is_active } = await request.json();
    const db = await openDb();
    
    const result = await db.run(
      'INSERT INTO homepage_content (section, title, content, image_url, button_text, button_url, order_index, is_active) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [section, title, content, image_url, button_text, button_url, order_index || 0, is_active !== false]
    );

    return NextResponse.json({ id: result.lastID, message: 'Homepage content created' });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create homepage content' },
      { status: 500 }
    );
  }
}