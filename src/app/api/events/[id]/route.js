import { NextResponse } from 'next/server';
import { openDb } from '../../../../../lib/database';

export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const { title, description, date, location, image_url, is_featured, is_active } = await request.json();
    const db = await openDb();
    
    await db.run(
      'UPDATE events SET title = ?, description = ?, date = ?, location = ?, image_url = ?, is_featured = ?, is_active = ? WHERE id = ?',
      [title, description, date, location, image_url, is_featured, is_active, id]
    );

    return NextResponse.json({ message: 'Event updated' });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update event' },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    const db = await openDb();
    
    await db.run('DELETE FROM events WHERE id = ?', [id]);

    return NextResponse.json({ message: 'Event deleted' });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete event' },
      { status: 500 }
    );
  }
}