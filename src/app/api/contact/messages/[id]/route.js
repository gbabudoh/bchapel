import { NextResponse } from 'next/server';
import { openDb } from '../../../../../../lib/database';

export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const { is_read } = await request.json();
    const db = await openDb();
    
    await db.run(
      'UPDATE contact_messages SET is_read = ? WHERE id = ?',
      [is_read, id]
    );

    return NextResponse.json({ message: 'Message updated' });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update message' },
      { status: 500 }
    );
  }
}