import { NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma';

export async function GET() {
  try {
    const givingOptions = await prisma.givingOption.findMany({
      orderBy: { id: 'asc' }
    });
    return NextResponse.json(givingOptions);
  } catch (error) {
    console.error('Failed to fetch giving options:', error);
    return NextResponse.json(
      { error: 'Failed to fetch giving options' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const { title, description, suggestedAmounts, type, isActive } = await request.json();
    
    const givingOption = await prisma.givingOption.create({
      data: {
        title,
        description,
        suggestedAmounts: suggestedAmounts ? JSON.stringify(suggested_amounts) : '[]',
        type: type || 'one-time',
        isActive: isActive !== false
      }
    });

    return NextResponse.json({ id: givingOption.id, message: 'Giving option created' });
  } catch (error) {
    console.error('Failed to create giving option:', error);
    return NextResponse.json(
      { error: 'Failed to create giving option' },
      { status: 500 }
    );
  }
}
