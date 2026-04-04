import { NextResponse } from 'next/server';
import prisma from '../../../../../lib/prisma';

export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const { section, title, content, imageUrl, buttonText, buttonUrl, orderIndex, isActive } = await request.json();
    
    await prisma.communityContent.update({
      where: { id: parseInt(id) },
      data: {
        section,
        title,
        content,
        imageUrl: imageUrl,
        buttonText: buttonText,
        buttonUrl: buttonUrl,
        orderIndex: orderIndex || 0,
        isActive: isActive !== false
      }
    });

    return NextResponse.json({ message: 'Community content updated' });
  } catch (error) {
    console.error('Failed to update community content:', error);
    return NextResponse.json(
      { error: 'Failed to update community content' },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    
    await prisma.communityContent.delete({
      where: { id: parseInt(id) }
    });

    return NextResponse.json({ message: 'Community content deleted' });
  } catch (error) {
    console.error('Failed to delete community content:', error);
    return NextResponse.json(
      { error: 'Failed to delete community content' },
      { status: 500 }
    );
  }
}
