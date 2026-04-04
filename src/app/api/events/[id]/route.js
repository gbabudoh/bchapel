import { NextResponse } from 'next/server';
import prisma from '../../../../../lib/prisma';

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const event = await prisma.event.findFirst({
      where: { 
        id: parseInt(id),
        isActive: true
      }
    });

    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }

    return NextResponse.json(event);
  } catch (error) {
    console.error('Error fetching event:', error);
    return NextResponse.json({ error: 'Failed to fetch event' }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const { title, description, date, location, imageUrl, isFeatured, isActive } = await request.json();
    
    const event = await prisma.event.update({
      where: { id: parseInt(id) },
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

    return NextResponse.json({ message: 'Event updated successfully' });
  } catch (error) {
    console.error('Error updating event:', error);
    if (error.code === 'P2025') {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }
    return NextResponse.json({ error: 'Failed to update event' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    
    await prisma.event.delete({
      where: { id: parseInt(id) }
    });

    return NextResponse.json({ message: 'Event deleted successfully' });
  } catch (error) {
    console.error('Error deleting event:', error);
    if (error.code === 'P2025') {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }
    return NextResponse.json({ error: 'Failed to delete event' }, { status: 500 });
  }
}
