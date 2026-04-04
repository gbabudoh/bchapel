import { NextResponse } from 'next/server';
import prisma from '../../../../../lib/prisma';

export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const { type, label, value, icon, isActive } = await request.json();
    
    await prisma.contactInfo.update({
      where: { id: parseInt(id) },
      data: {
        type,
        label,
        value,
        icon,
        isActive: isActive
      }
    });

    return NextResponse.json({ message: 'Contact information updated' });
  } catch (error) {
    console.error('Failed to update contact information:', error);
    return NextResponse.json(
      { error: 'Failed to update contact information' },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    
    await prisma.contactInfo.delete({
      where: { id: parseInt(id) }
    });

    return NextResponse.json({ message: 'Contact information deleted' });
  } catch (error) {
    console.error('Failed to delete contact information:', error);
    return NextResponse.json(
      { error: 'Failed to delete contact information' },
      { status: 500 }
    );
  }
}
