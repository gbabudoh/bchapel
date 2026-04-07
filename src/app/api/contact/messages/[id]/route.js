import { NextResponse } from 'next/server';
import prisma from '../../../../../../lib/prisma';

export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const { isRead } = await request.json();

    await prisma.contactMessage.update({
      where: { id: parseInt(id) },
      data: { isRead },
    });

    return NextResponse.json({ message: 'Message updated' });
  } catch (error) {
    console.error('Failed to update message:', error);
    return NextResponse.json({ error: 'Failed to update message' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;

    await prisma.contactMessage.delete({
      where: { id: parseInt(id) },
    });

    return NextResponse.json({ message: 'Message deleted' });
  } catch (error) {
    console.error('Failed to delete message:', error);
    return NextResponse.json({ error: 'Failed to delete message' }, { status: 500 });
  }
}
