import { NextResponse } from 'next/server';
import prisma from '../../../../../lib/prisma';

export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const { section, title, content, imageUrl, layout, orderIndex, isActive } = await request.json();
    
    await prisma.aboutContent.update({
      where: { id: parseInt(id) },
      data: {
        section,
        title,
        content,
        imageUrl: imageUrl,
        layout,
        orderIndex: orderIndex,
        isActive: isActive
      }
    });

    return NextResponse.json({ message: 'About content updated' });
  } catch (error) {
    console.error('Failed to update about content:', error);
    return NextResponse.json(
      { error: 'Failed to update about content' },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    
    await prisma.aboutContent.delete({
      where: { id: parseInt(id) }
    });

    return NextResponse.json({ message: 'About content deleted' });
  } catch (error) {
    console.error('Failed to delete about content:', error);
    return NextResponse.json(
      { error: 'Failed to delete about content' },
      { status: 500 }
    );
  }
}
