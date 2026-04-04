import { NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma';

export async function GET() {
  try {
    const events = await prisma.event.findMany({
      orderBy: { date: 'desc' }
    });
    return NextResponse.json(events);
  } catch (error) {
    console.error('Failed to fetch events:', error);
    return NextResponse.json(
      { error: 'Failed to fetch events' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const { title, description, date, location, imageUrl, isFeatured, isActive } = await request.json();
    
    const event = await prisma.event.create({
      data: {
        title,
        description,
        date,
        location,
        imageUrl: imageUrl,
        isFeatured: isFeatured || false,
        isActive: isActive !== false
      }
    });

    return NextResponse.json({ id: event.id, message: 'Event created' });
  } catch (error) {
    console.error('Failed to create event:', error);
    return NextResponse.json(
      { error: 'Failed to create event' },
      { status: 500 }
    );
  }
}
