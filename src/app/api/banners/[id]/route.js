import { NextResponse } from 'next/server';
import prisma from '../../../../../lib/prisma';

export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const { title, subtitle, imageUrl, buttonText, buttonUrl, orderIndex, isActive } = await request.json();
    
    await prisma.banner.update({
      where: { id: parseInt(id) },
      data: {
        title,
        subtitle,
        imageUrl: imageUrl,
        buttonText: buttonText,
        buttonUrl: buttonUrl,
        orderIndex: orderIndex,
        isActive: isActive
      }
    });

    return NextResponse.json({ message: 'Banner updated' });
  } catch (error) {
    console.error('Failed to update banner:', error);
    return NextResponse.json(
      { error: 'Failed to update banner' },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    
    await prisma.banner.delete({
      where: { id: parseInt(id) }
    });

    return NextResponse.json({ message: 'Banner deleted' });
  } catch (error) {
    console.error('Failed to delete banner:', error);
    return NextResponse.json(
      { error: 'Failed to delete banner' },
      { status: 500 }
    );
  }
}
