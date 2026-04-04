import { NextResponse } from 'next/server';
import prisma from '../../../../../lib/prisma';

export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const { title, description, suggestedAmounts, type, isActive } = await request.json();
    
    await prisma.givingOption.update({
      where: { id: parseInt(id) },
      data: {
        title,
        description,
        suggestedAmounts: suggestedAmounts ? JSON.stringify(suggested_amounts) : undefined,
        type,
        isActive: isActive
      }
    });

    return NextResponse.json({ message: 'Giving option updated' });
  } catch (error) {
    console.error('Failed to update giving option:', error);
    return NextResponse.json(
      { error: 'Failed to update giving option' },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    
    await prisma.givingOption.delete({
      where: { id: parseInt(id) }
    });

    return NextResponse.json({ message: 'Giving option deleted' });
  } catch (error) {
    console.error('Failed to delete giving option:', error);
    return NextResponse.json(
      { error: 'Failed to delete giving option' },
      { status: 500 }
    );
  }
}
