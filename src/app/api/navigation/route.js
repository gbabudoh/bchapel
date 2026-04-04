import { NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma';

export async function GET() {
  try {
    const navigation = await prisma.navigation.findMany({
      orderBy: { orderIndex: 'asc' }
    });
    return NextResponse.json(navigation);
  } catch (error) {
    console.error('Navigation API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch navigation', details: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const { title, url, orderIndex, isActive } = await request.json();
    
    const navItem = await prisma.navigation.create({
      data: {
        title,
        url,
        orderIndex: orderIndex || 0,
        isActive: isActive !== false
      }
    });

    return NextResponse.json({ id: navItem.id, message: 'Navigation item created' });
  } catch (error) {
    console.error('Failed to create navigation item:', error);
    return NextResponse.json(
      { error: 'Failed to create navigation item' },
      { status: 500 }
    );
  }
}
