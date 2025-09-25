import { NextResponse } from 'next/server';
import { openDb } from '../../../../lib/database';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 20;
    const offset = (page - 1) * limit;

    const db = await openDb();
    
    let query = 'SELECT * FROM images';
    let countQuery = 'SELECT COUNT(*) as total FROM images';
    let params = [];

    if (category) {
      query += ' WHERE category = ?';
      countQuery += ' WHERE category = ?';
      params.push(category);
    }

    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    params.push(limit, offset);

    const images = await db.all(query, params);
    const totalResult = await db.get(countQuery, category ? [category] : []);
    const total = totalResult.total;

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

    const db = await openDb();
    
    // Get image info before deleting
    const image = await db.get('SELECT * FROM images WHERE id = ?', [id]);
    if (!image) {
      return NextResponse.json({ error: 'Image not found' }, { status: 404 });
    }

    // Delete from database
    await db.run('DELETE FROM images WHERE id = ?', [id]);

    // Delete physical file
    const fs = require('fs').promises;
    const path = require('path');
    const filePath = path.join(process.cwd(), 'public', image.file_path);
    
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