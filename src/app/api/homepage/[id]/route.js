import { NextResponse } from 'next/server';
import { openDb } from '../../../../../lib/database';

export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const { section, title, content, image_url, button_text, button_url, order_index, is_active } = await request.json();
    const db = await openDb();
    
    await db.run(
      'UPDATE homepage_content SET section = ?, title = ?, content = ?, image_url = ?, button_text = ?, button_url = ?, order_index = ?, is_active = ? WHERE id = ?',
      [section, title, content, image_url, button_text, button_url, order_index, is_active, id]
    );

    return NextResponse.json({ message: 'Homepage content updated' });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update homepage content' },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    const db = await openDb();
    
    await db.run('DELETE FROM homepage_content WHERE id = ?', [id]);

    return NextResponse.json({ message: 'Homepage content deleted' });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete homepage content' },
      { status: 500 }
    );
  }
}