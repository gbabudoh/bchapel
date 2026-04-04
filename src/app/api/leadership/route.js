import { NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma';

export async function GET() {
  try {
    const leadership = await prisma.leadership.findMany({
      orderBy: { orderIndex: 'asc' }
    });
    return NextResponse.json(leadership);
  } catch (error) {
    console.error('Failed to fetch leadership:', error);
    return NextResponse.json(
      { error: 'Failed to fetch leadership' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const { name, position, bio, imageUrl, orderIndex, isActive } = await request.json();
    
    const leader = await prisma.leadership.create({
      data: {
        name,
        position,
        bio,
        imageUrl: imageUrl,
        orderIndex: orderIndex || 0,
        isActive: isActive !== false
      }
    });

    return NextResponse.json({ id: leader.id, message: 'Leader created' });
  } catch (error) {
    console.error('Failed to create leader:', error);
    return NextResponse.json(
      { error: 'Failed to create leader' },
      { status: 500 }
    );
  }
}
