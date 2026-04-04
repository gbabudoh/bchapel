import { NextResponse } from 'next/server';
import prisma from '../../../../../lib/prisma';

export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const { section, title, content, url, icon, orderIndex, isActive } = await request.json();
    
    await prisma.footerItem.update({
      where: { id: parseInt(id) },
      data: {
        section,
        title,
        content,
        url,
        icon,
        orderIndex,
        isActive
      }
    });

    return NextResponse.json({ message: 'Footer item updated' });
  } catch (error) {
    console.error('Failed to update footer item:', error);
    return NextResponse.json(
      { error: 'Failed to update footer item' },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    
    await prisma.footerItem.delete({
      where: { id: parseInt(id) }
    });

    return NextResponse.json({ message: 'Footer item deleted' });
  } catch (error) {
    console.error('Failed to delete footer item:', error);
    return NextResponse.json(
      { error: 'Failed to delete footer item' },
      { status: 500 }
    );
  }
}
