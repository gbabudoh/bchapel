import { NextResponse } from 'next/server';
import { openDb } from '../../../../lib/database';

export async function GET() {
  try {
    const db = await openDb();
    const contact = await db.all(
      'SELECT * FROM contact_info ORDER BY type, id'
    );
    return NextResponse.json(contact);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch contact information' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const { type, label, value, icon, is_active } = await request.json();
    const db = await openDb();
    
    const result = await db.run(
      'INSERT INTO contact_info (type, label, value, icon, is_active) VALUES (?, ?, ?, ?, ?)',
      [type, label, value, icon || null, is_active !== false]
    );

    return NextResponse.json({ id: result.lastID, message: 'Contact information created' });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create contact information' },
      { status: 500 }
    );
  }
}