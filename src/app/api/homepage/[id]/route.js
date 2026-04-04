import { NextResponse } from 'next/server';
import prisma from '../../../../../lib/prisma';

export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const { section, title, content, imageUrl, buttonText, buttonUrl, orderIndex, isActive } = await request.json();
    
    await prisma.homepageContent.update({
      where: { id: parseInt(id) },
      data: {
        section,
        title,
        content,
        imageUrl: imageUrl,
        buttonText: buttonText,
        buttonUrl: buttonUrl,
        orderIndex: orderIndex,
        isActive: isActive
      }
    });

    return NextResponse.json({ message: 'Homepage content updated' });
  } catch (error) {
    console.error('Failed to update homepage content:', error);
    return NextResponse.json(
      { error: 'Failed to update homepage content' },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    
    await prisma.homepageContent.delete({
      where: { id: parseInt(id) }
    });

    return NextResponse.json({ message: 'Homepage content deleted' });
  } catch (error) {
    console.error('Failed to delete homepage content:', error);
    return NextResponse.json(
      { error: 'Failed to delete homepage content' },
      { status: 500 }
    );
  }
}
