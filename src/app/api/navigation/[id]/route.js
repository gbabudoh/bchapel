import { NextResponse } from 'next/server';
import { openDb } from '../../../../../lib/database';

export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const { title, url, order_index, is_active } = await request.json();
    const db = await openDb();
    
    await db.run(
      'UPDATE navigation SET title = ?, url = ?, order_index = ?, is_active = ? WHERE id = ?',
      [title, url, order_index, is_active, id]
    );

    return NextResponse.json({ message: 'Navigation item updated' });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update navigation item' },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    const db = await openDb();
    
    await db.run('DELETE FROM navigation WHERE id = ?', [id]);

    return NextResponse.json({ message: 'Navigation item deleted' });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete navigation item' },
      { status: 500 }
    );
  }
}