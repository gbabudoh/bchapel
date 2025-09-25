import { NextResponse } from 'next/server';
import { openDb } from '../../../../../lib/database';

export async function GET() {
  try {
    const db = await openDb();
    const messages = await db.all(
      'SELECT * FROM contact_messages ORDER BY created_at DESC'
    );
    return NextResponse.json(messages);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch messages' },
      { status: 500 }
    );
  }
}