import { NextResponse } from 'next/server';
import { openDb } from '../../../../../lib/database';

export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const { title, subtitle, image_url, button_text, button_url, order_index, is_active } = await request.json();
    const db = await openDb();
    
    await db.run(
      'UPDATE banners SET title = ?, subtitle = ?, image_url = ?, button_text = ?, button_url = ?, order_index = ?, is_active = ? WHERE id = ?',
      [title, subtitle, image_url, button_text, button_url, order_index, is_active, id]
    );

    return NextResponse.json({ message: 'Banner updated' });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update banner' },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    const db = await openDb();
    
    await db.run('DELETE FROM banners WHERE id = ?', [id]);

    return NextResponse.json({ message: 'Banner deleted' });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete banner' },
      { status: 500 }
    );
  }
}