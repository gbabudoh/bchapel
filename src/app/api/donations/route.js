import { NextResponse } from 'next/server';
import { openDb } from '../../../../lib/database';

export async function GET() {
  try {
    const db = await openDb();
    const donations = await db.all(
      'SELECT * FROM donations ORDER BY created_at DESC LIMIT 100'
    );
    return NextResponse.json(donations);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch donations' },
      { status: 500 }
    );
  }
}