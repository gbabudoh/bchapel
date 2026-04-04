import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';

let db = null;

export async function openDb() {
  if (db) return db;
  
  const dbPath = path.join(process.cwd(), 'database.sqlite');
  
  db = await open({
    filename: dbPath,
    driver: sqlite3.Database,
  });

  // Enable foreign keys
  await db.exec('PRAGMA foreign_keys = ON;');

  // Create tables if they don't exist
  await db.exec(`
    CREATE TABLE IF NOT EXISTS admins (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      role TEXT DEFAULT 'admin',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  await db.exec(`
    CREATE TABLE IF NOT EXISTS navigation (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      url TEXT NOT NULL,
      order_index INTEGER DEFAULT 0,
      is_active BOOLEAN DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  await db.exec(`
    CREATE TABLE IF NOT EXISTS banners (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      subtitle TEXT,
      image_url TEXT,
      button_text TEXT,
      button_url TEXT,
      order_index INTEGER DEFAULT 0,
      is_active BOOLEAN DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  await db.exec(`
    CREATE TABLE IF NOT EXISTS homepage_content (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      section TEXT NOT NULL,
      title TEXT NOT NULL,
      content TEXT,
      image_url TEXT,
      button_text TEXT,
      button_url TEXT,
      order_index INTEGER DEFAULT 0,
      is_active BOOLEAN DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  await db.exec(`
    CREATE TABLE IF NOT EXISTS about_content (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      section TEXT NOT NULL,
      title TEXT NOT NULL,
      content TEXT,
      image_url TEXT,
      layout TEXT DEFAULT 'image-left',
      order_index INTEGER DEFAULT 0,
      is_active BOOLEAN DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Add layout column if it doesn't exist (for existing databases)
  try {
    await db.exec('ALTER TABLE about_content ADD COLUMN layout TEXT DEFAULT "image-left"');
  } catch (error) {
    // Column already exists, ignore error
  }

  await db.exec(`
    CREATE TABLE IF NOT EXISTS events (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT,
      date TEXT,
      location TEXT,
      image_url TEXT,
      is_featured BOOLEAN DEFAULT 0,
      is_active BOOLEAN DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  await db.exec(`
    CREATE TABLE IF NOT EXISTS leadership (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      position TEXT NOT NULL,
      bio TEXT,
      image_url TEXT,
      order_index INTEGER DEFAULT 0,
      is_active BOOLEAN DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  await db.exec(`
    CREATE TABLE IF NOT EXISTS community_content (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      section TEXT NOT NULL,
      title TEXT NOT NULL,
      content TEXT,
      image_url TEXT,
      button_text TEXT,
      button_url TEXT,
      order_index INTEGER DEFAULT 0,
      is_active BOOLEAN DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  await db.exec(`
    CREATE TABLE IF NOT EXISTS giving_options (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT,
      suggested_amounts TEXT,
      type TEXT DEFAULT 'one-time',
      is_active BOOLEAN DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  await db.exec(`
    CREATE TABLE IF NOT EXISTS donations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      amount DECIMAL(10,2) NOT NULL,
      type TEXT DEFAULT 'one-time',
      status TEXT DEFAULT 'pending',
      transaction_id TEXT,
      donor_email TEXT,
      donor_name TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  await db.exec(`
    CREATE TABLE IF NOT EXISTS contact_info (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      type TEXT NOT NULL,
      label TEXT NOT NULL,
      value TEXT NOT NULL,
      icon TEXT,
      is_active BOOLEAN DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  await db.exec(`
    CREATE TABLE IF NOT EXISTS contact_messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      message TEXT NOT NULL,
      is_read BOOLEAN DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  await db.exec(`
    CREATE TABLE IF NOT EXISTS images (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      filename TEXT NOT NULL,
      original_name TEXT NOT NULL,
      file_path TEXT NOT NULL,
      file_size INTEGER,
      mime_type TEXT,
      category TEXT DEFAULT 'general',
      alt_text TEXT,
      is_active BOOLEAN DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  await db.exec(`
    CREATE TABLE IF NOT EXISTS footer_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      section TEXT NOT NULL,
      title TEXT NOT NULL,
      content TEXT,
      url TEXT,
      icon TEXT,
      order_index INTEGER DEFAULT 0,
      is_active BOOLEAN DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  await db.exec(`
    CREATE TABLE IF NOT EXISTS seo_settings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      site_title TEXT DEFAULT 'Battersea Chapel',
      site_description TEXT DEFAULT 'Welcome to Battersea Chapel - A vibrant Christian community in London offering worship services, community programs, and spiritual growth opportunities for all ages.',
      site_keywords TEXT DEFAULT 'Battersea Chapel,Church London,Christian Community,Worship Services,Bible Study,Community Programs,Faith,Prayer,Sunday Service,London Church',
      site_url TEXT DEFAULT 'http://localhost:3000',
      google_analytics_id TEXT,
      facebook_url TEXT,
      instagram_url TEXT,
      youtube_url TEXT,
      twitter_url TEXT,
      og_image TEXT DEFAULT '/og-image.jpg',
      contact_email TEXT,
      contact_phone TEXT,
      address TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Insert default admin user (password: admin123)
  const adminExists = await db.get('SELECT id FROM admins WHERE username = ?', ['admin']);
  if (!adminExists) {
    const bcrypt = require('bcryptjs');
    const hashedPassword = await bcrypt.hash('admin123', 12);
    await db.run(
      'INSERT INTO admins (username, email, password, role) VALUES (?, ?, ?, ?)',
      ['admin', 'admin@bchapel.com', hashedPassword, 'super_admin']
    );
  }

  // Insert default navigation items
  const navigationExists = await db.get('SELECT id FROM navigation LIMIT 1');
  if (!navigationExists) {
    await db.run(
      'INSERT INTO navigation (title, url, order_index, is_active) VALUES (?, ?, ?, ?)',
      ['Home', '/', 1, 1]
    );
    await db.run(
      'INSERT INTO navigation (title, url, order_index, is_active) VALUES (?, ?, ?, ?)',
      ['About', '/about', 2, 1]
    );
    await db.run(
      'INSERT INTO navigation (title, url, order_index, is_active) VALUES (?, ?, ?, ?)',
      ['Events', '/events', 3, 1]
    );
    await db.run(
      'INSERT INTO navigation (title, url, order_index, is_active) VALUES (?, ?, ?, ?)',
      ['Leadership', '/leadership', 4, 1]
    );
    await db.run(
      'INSERT INTO navigation (title, url, order_index, is_active) VALUES (?, ?, ?, ?)',
      ['Community', '/community', 5, 1]
    );
    await db.run(
      'INSERT INTO navigation (title, url, order_index, is_active) VALUES (?, ?, ?, ?)',
      ['Giving', '/giving', 6, 1]
    );
    await db.run(
      'INSERT INTO navigation (title, url, order_index, is_active) VALUES (?, ?, ?, ?)',
      ['Contact', '/contact', 7, 1]
    );
  }

  // Insert default footer items
  const footerItemsExist = await db.get('SELECT id FROM footer_items LIMIT 1');
  if (!footerItemsExist) {
    // Quick Links section
    await db.run(
      'INSERT INTO footer_items (section, title, content, url, icon, order_index, is_active) VALUES (?, ?, ?, ?, ?, ?, ?)',
      ['quick-links', 'Home', '', '/', 'Home', 1, 1]
    );
    await db.run(
      'INSERT INTO footer_items (section, title, content, url, icon, order_index, is_active) VALUES (?, ?, ?, ?, ?, ?, ?)',
      ['quick-links', 'About Us', '', '/about', 'Info', 2, 1]
    );
    await db.run(
      'INSERT INTO footer_items (section, title, content, url, icon, order_index, is_active) VALUES (?, ?, ?, ?, ?, ?, ?)',
      ['quick-links', 'Events', '', '/events', 'Calendar', 3, 1]
    );
    await db.run(
      'INSERT INTO footer_items (section, title, content, url, icon, order_index, is_active) VALUES (?, ?, ?, ?, ?, ?, ?)',
      ['quick-links', 'Contact', '', '/contact', 'Mail', 4, 1]
    );

    // Ministries section
    await db.run(
      'INSERT INTO footer_items (section, title, content, url, icon, order_index, is_active) VALUES (?, ?, ?, ?, ?, ?, ?)',
      ['ministries', 'Youth Ministry', '', '/community', 'Users', 1, 1]
    );
    await db.run(
      'INSERT INTO footer_items (section, title, content, url, icon, order_index, is_active) VALUES (?, ?, ?, ?, ?, ?, ?)',
      ['ministries', 'Children\'s Church', '', '/community', 'Baby', 2, 1]
    );
    await db.run(
      'INSERT INTO footer_items (section, title, content, url, icon, order_index, is_active) VALUES (?, ?, ?, ?, ?, ?, ?)',
      ['ministries', 'Women\'s Fellowship', '', '/community', 'Heart', 3, 1]
    );
    await db.run(
      'INSERT INTO footer_items (section, title, content, url, icon, order_index, is_active) VALUES (?, ?, ?, ?, ?, ?, ?)',
      ['ministries', 'Men\'s Ministry', '', '/community', 'Users', 4, 1]
    );
  }

  // Insert default giving options
  const givingOptionsExist = await db.get('SELECT id FROM giving_options LIMIT 1');
  if (!givingOptionsExist) {
    await db.run(
      'INSERT INTO giving_options (title, description, suggested_amounts, is_active) VALUES (?, ?, ?, ?)',
      ['Tithe', 'Support the ongoing ministry and operations of our church', JSON.stringify([25, 50, 100, 250]), 1]
    );
    await db.run(
      'INSERT INTO giving_options (title, description, suggested_amounts, is_active) VALUES (?, ?, ?, ?)',
      ['Offering', 'Special offerings for missions and community outreach', JSON.stringify([20, 40, 75, 150]), 1]
    );
    await db.run(
      'INSERT INTO giving_options (title, description, suggested_amounts, is_active) VALUES (?, ?, ?, ?)',
      ['Support Fund', 'Help us maintain and improve our church facilities', JSON.stringify([50, 100, 200, 500]), 1]
    );
  }

  // Insert default admin user if none exists
  const defaultAdminExists = await db.get('SELECT id FROM admins LIMIT 1');
  if (!defaultAdminExists) {
    const bcrypt = require('bcryptjs');
    const hashedPassword = await bcrypt.hash('admin123', 10);
    await db.run(
      'INSERT INTO admins (username, email, password, role) VALUES (?, ?, ?, ?)',
      ['admin', 'admin@batterseachapel.com', hashedPassword, 'admin']
    );
  }

  // Insert default SEO settings if none exist
  const seoSettingsExist = await db.get('SELECT id FROM seo_settings LIMIT 1');
  if (!seoSettingsExist) {
    await db.run(`
      INSERT INTO seo_settings (
        site_title, 
        site_description, 
        site_keywords, 
        site_url,
        contact_email
      ) VALUES (?, ?, ?, ?, ?)
    `, [
      'Battersea Chapel - A Place of Worship, Community & Faith',
      'Welcome to Battersea Chapel - A vibrant Christian community in London offering worship services, community programs, and spiritual growth opportunities for all ages.',
      'Battersea Chapel,Church London,Christian Community,Worship Services,Bible Study,Community Programs,Faith,Prayer,Sunday Service,London Church',
      process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
      'admin@batterseachapel.com'
    ]);
  }

  return db;
}