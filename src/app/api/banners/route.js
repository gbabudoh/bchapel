import { NextResponse } from 'next/server';
import { openDb } from '../../../../lib/database';

export async function GET() {
  try {
    const db = await openDb();
    const banners = await db.all(
      'SELECT * FROM banners ORDER BY order_index ASC'
    );
    return NextResponse.json(banners);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch banners' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const { title, subtitle, image_url, button_text, button_url, order_index, is_active } = await request.json();
    const db = await openDb();
    
    const result = await db.run(
      'INSERT INTO banners (title, subtitle, image_url, button_text, button_url, order_index, is_active) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [title, subtitle, image_url, button_text, button_url, order_index || 0, is_active !== false]
    );

    return NextResponse.json({ id: result.lastID, message: 'Banner created' });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create banner' },
      { status: 500 }
    );
  }
}