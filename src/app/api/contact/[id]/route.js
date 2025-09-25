import { NextResponse } from 'next/server';
import { openDb } from '../../../../../lib/database';

export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const { type, label, value, icon, is_active } = await request.json();
    const db = await openDb();
    
    await db.run(
      'UPDATE contact_info SET type = ?, label = ?, value = ?, icon = ?, is_active = ? WHERE id = ?',
      [type, label, value, icon, is_active, id]
    );

    return NextResponse.json({ message: 'Contact information updated' });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update contact information' },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    const db = await openDb();
    
    await db.run('DELETE FROM contact_info WHERE id = ?', [id]);

    return NextResponse.json({ message: 'Contact information deleted' });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete contact information' },
      { status: 500 }
    );
  }
}