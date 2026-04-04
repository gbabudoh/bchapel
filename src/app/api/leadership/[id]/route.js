import { NextResponse } from 'next/server';
import prisma from '../../../../../lib/prisma';

export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const { name, position, bio, imageUrl, orderIndex, isActive } = await request.json();
    
    await prisma.leadership.update({
      where: { id: parseInt(id) },
      data: {
        name,
        position,
        bio,
        imageUrl: imageUrl,
        orderIndex: orderIndex,
        isActive: isActive
      }
    });

    return NextResponse.json({ message: 'Leader updated' });
  } catch (error) {
    console.error('Failed to update leader:', error);
    return NextResponse.json(
      { error: 'Failed to update leader' },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    
    await prisma.leadership.delete({
      where: { id: parseInt(id) }
    });

    return NextResponse.json({ message: 'Leader deleted' });
  } catch (error) {
    console.error('Failed to delete leader:', error);
    return NextResponse.json(
      { error: 'Failed to delete leader' },
      { status: 500 }
    );
  }
}
