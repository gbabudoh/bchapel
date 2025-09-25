import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { openDb } from '../../../../lib/database';

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');
    const category = formData.get('category') || 'general';
    const alt_text = formData.get('alt_text') || '';
    const title = formData.get('title') || '';

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ 
        error: 'Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed.' 
      }, { status: 400 });
    }

    // Validate file size (5MB limit)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return NextResponse.json({ 
        error: 'File too large. Maximum size is 5MB.' 
      }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create uploads directory if it doesn't exist
    const uploadsDir = join(process.cwd(), 'public', 'uploads');
    const categoryDir = join(uploadsDir, category);
    
    try {
      await mkdir(categoryDir, { recursive: true });
    } catch (error) {
      // Directory might already exist
    }

    // Generate unique filename
    const timestamp = Date.now();
    const originalName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const filename = `${timestamp}_${originalName}`;
    const filepath = join(categoryDir, filename);

    // Write file
    await writeFile(filepath, buffer);

    // Save to database
    const db = await openDb();
    const result = await db.run(`
      INSERT INTO images (
        filename, 
        original_name, 
        file_path, 
        file_size, 
        mime_type, 
        category, 
        title, 
        alt_text,
        created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))
    `, [
      filename,
      file.name,
      `/uploads/${category}/${filename}`,
      file.size,
      file.type,
      category,
      title,
      alt_text
    ]);

    return NextResponse.json({
      success: true,
      image: {
        id: result.lastID,
        filename,
        file_path: `/uploads/${category}/${filename}`,
        title,
        alt_text,
        category,
        file_size: file.size,
        mime_type: file.type
      }
    });

  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ 
      error: 'Failed to upload image' 
    }, { status: 500 });
  }
}