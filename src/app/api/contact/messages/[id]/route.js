import { NextResponse } from 'next/server';
import prisma from '../../../../../../lib/prisma';

export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const { isRead } = await request.json();
    
    await prisma.contactMessage.update({
      where: { id: parseInt(id) },
      data: { isRead: isRead }
    });

    return NextResponse.json({ message: 'Message updated' });
  } catch (error) {
    console.error('Failed to update message:', error);
    return NextResponse.json(
      { error: 'Failed to update message' },
      { status: 500 }
    );
  }
}
