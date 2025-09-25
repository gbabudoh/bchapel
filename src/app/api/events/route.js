import { NextResponse } from 'next/server';
import { openDb } from '../../../../lib/database';

export async function GET() {
  try {
    const db = await openDb();
    const events = await db.all(
      'SELECT * FROM events ORDER BY date DESC'
    );
    return NextResponse.json(events);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch events' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const { title, description, date, location, image_url, is_featured, is_active } = await request.json();
    const db = await openDb();
    
    const result = await db.run(
      'INSERT INTO events (title, description, date, location, image_url, is_featured, is_active) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [title, description, date, location, image_url, is_featured || false, is_active !== false]
    );

    return NextResponse.json({ id: result.lastID, message: 'Event created' });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create event' },
      { status: 500 }
    );
  }
}