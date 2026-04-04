import { NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma';

export async function GET() {
  try {
    const communityContent = await prisma.communityContent.findMany({
      orderBy: { orderIndex: 'asc' }
    });
    return NextResponse.json(communityContent);
  } catch (error) {
    console.error('Failed to fetch community content:', error);
    return NextResponse.json(
      { error: 'Failed to fetch community content' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const { section, title, content, imageUrl, buttonText, buttonUrl, orderIndex, isActive } = await request.json();
    
    const communityContent = await prisma.communityContent.create({
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

    return NextResponse.json({ id: communityContent.id, message: 'Community content created' });
  } catch (error) {
    console.error('Failed to create community content:', error);
    return NextResponse.json(
      { error: 'Failed to create community content' },
      { status: 500 }
    );
  }
}
