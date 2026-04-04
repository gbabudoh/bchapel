import { NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma';

export async function GET() {
  try {
    const contact = await prisma.contactInfo.findMany({
      orderBy: [{ type: 'asc' }, { id: 'asc' }]
    });
    return NextResponse.json(contact);
  } catch (error) {
    console.error('Failed to fetch contact information:', error);
    return NextResponse.json(
      { error: 'Failed to fetch contact information' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const { type, label, value, icon, isActive } = await request.json();
    
    const contactInfo = await prisma.contactInfo.create({
      data: {
        type,
        label,
        value,
        icon: icon || null,
        isActive: isActive !== false
      }
    });

    return NextResponse.json({ id: contactInfo.id, message: 'Contact information created' });
  } catch (error) {
    console.error('Failed to create contact information:', error);
    return NextResponse.json(
      { error: 'Failed to create contact information' },
      { status: 500 }
    );
  }
}
