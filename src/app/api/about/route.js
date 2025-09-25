import { NextResponse } from 'next/server';
import { openDb } from '../../../../lib/database';

export async function GET() {
  try {
    const db = await openDb();
    const aboutContent = await db.all(
      'SELECT * FROM about_content ORDER BY order_index ASC'
    );
    return NextResponse.json(aboutContent);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch about content' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const { section, title, content, image_url, order_index, is_active } = await request.json();
    const db = await openDb();
    
    const result = await db.run(
      'INSERT INTO about_content (section, title, content, image_url, order_index, is_active) VALUES (?, ?, ?, ?, ?, ?)',
      [section, title, content, image_url, order_index || 0, is_active !== false]
    );

    return NextResponse.json({ id: result.lastID, message: 'About content created' });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create about content' },
      { status: 500 }
    );
  }
}