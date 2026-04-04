import { NextResponse } from 'next/server';
import prisma from '../../../../../lib/prisma';

export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const { title, url, orderIndex, isActive } = await request.json();
    
    await prisma.navigation.update({
      where: { id: parseInt(id) },
      data: {
        title,
        url,
        orderIndex: orderIndex,
        isActive: isActive
      }
    });

    return NextResponse.json({ message: 'Navigation item updated' });
  } catch (error) {
    console.error('Failed to update navigation item:', error);
    return NextResponse.json(
      { error: 'Failed to update navigation item' },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    
    await prisma.navigation.delete({
      where: { id: parseInt(id) }
    });

    return NextResponse.json({ message: 'Navigation item deleted' });
  } catch (error) {
    console.error('Failed to delete navigation item:', error);
    return NextResponse.json(
      { error: 'Failed to delete navigation item' },
      { status: 500 }
    );
  }
}
