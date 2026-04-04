import { NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma';

export async function GET() {
  try {
    const aboutContent = await prisma.aboutContent.findMany({
      orderBy: { orderIndex: 'asc' }
    });
    return NextResponse.json(aboutContent);
  } catch (error) {
    console.error('Failed to fetch about content:', error);
    return NextResponse.json(
      { error: 'Failed to fetch about content' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const { section, title, content, imageUrl, layout, orderIndex, isActive } = await request.json();
    
    const aboutContent = await prisma.aboutContent.create({
      data: {
        section,
        title,
        content,
        imageUrl: imageUrl,
        layout: layout || 'image-left',
        orderIndex: orderIndex || 0,
        isActive: isActive !== false
      }
    });

    return NextResponse.json({ id: aboutContent.id, message: 'About content created' });
  } catch (error) {
    console.error('Failed to create about content:', error);
    return NextResponse.json(
      { error: 'Failed to create about content' },
      { status: 500 }
    );
  }
}
