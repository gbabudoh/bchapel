import { NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma';

export async function GET() {
  try {
    const content = await prisma.homepageContent.findMany({
      orderBy: { orderIndex: 'asc' }
    });
    return NextResponse.json(content);
  } catch (error) {
    console.error('Failed to fetch homepage content:', error);
    return NextResponse.json(
      { error: 'Failed to fetch homepage content' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const { section, title, content, imageUrl, buttonText, buttonUrl, orderIndex, isActive } = await request.json();
    
    const homepageContent = await prisma.homepageContent.create({
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

    return NextResponse.json({ id: homepageContent.id, message: 'Homepage content created' });
  } catch (error) {
    console.error('Failed to create homepage content:', error);
    return NextResponse.json(
      { error: 'Failed to create homepage content' },
      { status: 500 }
    );
  }
}
