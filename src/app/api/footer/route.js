import { NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma';

export async function GET() {
  try {
    const footerItems = await prisma.footerItem.findMany({
      orderBy: [{ section: 'asc' }, { orderIndex: 'asc' }]
    });
    return NextResponse.json(footerItems);
  } catch (error) {
    console.error('Failed to fetch footer items:', error);
    return NextResponse.json(
      { error: 'Failed to fetch footer items' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const { section, title, content, url, icon, orderIndex, isActive } = await request.json();
    
    const footerItem = await prisma.footerItem.create({
      data: {
        section,
        title,
        content,
        url,
        icon,
        orderIndex: orderIndex || 0,
        isActive: isActive !== false
      }
    });

    return NextResponse.json({ id: footerItem.id, message: 'Footer item created' });
  } catch (error) {
    console.error('Failed to create footer item:', error);
    return NextResponse.json(
      { error: 'Failed to create footer item' },
      { status: 500 }
    );
  }
}
