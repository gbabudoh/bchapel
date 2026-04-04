import { NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma';

export async function GET() {
  try {
    const banners = await prisma.banner.findMany({
      orderBy: { orderIndex: 'asc' }
    });
    return NextResponse.json(banners);
  } catch (error) {
    console.error('Failed to fetch banners:', error);
    return NextResponse.json(
      { error: 'Failed to fetch banners' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const { title, subtitle, imageUrl, buttonText, buttonUrl, orderIndex, isActive } = await request.json();
    
    const banner = await prisma.banner.create({
      data: {
        title,
        subtitle,
        imageUrl: imageUrl,
        buttonText: buttonText,
        buttonUrl: buttonUrl,
        orderIndex: orderIndex || 0,
        isActive: isActive !== false
      }
    });

    return NextResponse.json({ id: banner.id, message: 'Banner created' });
  } catch (error) {
    console.error('Failed to create banner:', error);
    return NextResponse.json(
      { error: 'Failed to create banner' },
      { status: 500 }
    );
  }
}
