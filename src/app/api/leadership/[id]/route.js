import { NextResponse } from 'next/server';
import { openDb } from '../../../../../lib/database';

export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const { name, position, bio, image_url, order_index, is_active } = await request.json();
    const db = await openDb();
    
    await db.run(
      'UPDATE leadership SET name = ?, position = ?, bio = ?, image_url = ?, order_index = ?, is_active = ? WHERE id = ?',
      [name, position, bio, image_url, order_index, is_active, id]
    );

    return NextResponse.json({ message: 'Leader updated' });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update leader' },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    const db = await openDb();
    
    await db.run('DELETE FROM leadership WHERE id = ?', [id]);

    return NextResponse.json({ message: 'Leader deleted' });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete leader' },
      { status: 500 }
    );
  }
}