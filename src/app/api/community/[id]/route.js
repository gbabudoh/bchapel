import { NextResponse } from 'next/server';
import { openDb } from '../../../../../lib/database';

export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const { section, title, content, image_url, button_text, button_url, order_index, is_active } = await request.json();
    const db = await openDb();
    
    await db.run(
      'UPDATE community_content SET section = ?, title = ?, content = ?, image_url = ?, button_text = ?, button_url = ?, order_index = ?, is_active = ? WHERE id = ?',
      [section, title, content, image_url, button_text, button_url, order_index, is_active, id]
    );

    return NextResponse.json({ message: 'Community content updated' });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update community content' },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    const db = await openDb();
    
    await db.run('DELETE FROM community_content WHERE id = ?', [id]);

    return NextResponse.json({ message: 'Community content deleted' });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete community content' },
      { status: 500 }
    );
  }
}