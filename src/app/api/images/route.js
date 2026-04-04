import { NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 20;
    const skip = (page - 1) * limit;

    const where = category ? { category } : {};

    const [images, total] = await Promise.all([
      prisma.image.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip
      }),
      prisma.image.count({ where })
    ]);

    return NextResponse.json({
      images,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching images:', error);
    return NextResponse.json({ error: 'Failed to fetch images' }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Image ID required' }, { status: 400 });
    }

    const image = await prisma.image.findUnique({
      where: { id: parseInt(id) }
    });

    if (!image) {
      return NextResponse.json({ error: 'Image not found' }, { status: 404 });
    }

    await prisma.image.delete({
      where: { id: parseInt(id) }
    });

    // Delete physical file
    const fs = require('fs').promises;
    const path = require('path');
    const filePath = path.join(process.cwd(), 'public', image.filePath);
    
    try {
      await fs.unlink(filePath);
    } catch (error) {
      console.warn('Could not delete physical file:', error);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting image:', error);
    return NextResponse.json({ error: 'Failed to delete image' }, { status: 500 });
  }
}
