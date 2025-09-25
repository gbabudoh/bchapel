import { NextResponse } from 'next/server';
import { openDb } from '../../../../../lib/database';

export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const { section, title, content, url, icon, order_index, is_active } = await request.json();
    const db = await openDb();
    
    await db.run(
      'UPDATE footer_items SET section = ?, title = ?, content = ?, url = ?, icon = ?, order_index = ?, is_active = ? WHERE id = ?',
      [section, title, content, url, icon, order_index, is_active, id]
    );

    return NextResponse.json({ message: 'Footer item updated' });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update footer item' },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    const db = await openDb();
    
    await db.run('DELETE FROM footer_items WHERE id = ?', [id]);

    return NextResponse.json({ message: 'Footer item deleted' });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete footer item' },
      { status: 500 }
    );
  }
}