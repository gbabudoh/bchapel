import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import bcrypt from 'bcryptjs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function resetAdmin() {
  try {
    const dbPath = path.join(process.cwd(), 'database.sqlite');
    
    const db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });

    console.log('Connected to database...');

    // Check if admin table exists
    const tableExists = await db.get(
      "SELECT name FROM sqlite_master WHERE type='table' AND name='admins'"
    );

    if (!tableExists) {
      console.log('Creating admins table...');
      await db.exec(`
        CREATE TABLE admins (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          username TEXT UNIQUE NOT NULL,
          email TEXT UNIQUE NOT NULL,
          password TEXT NOT NULL,
          role TEXT DEFAULT 'admin',
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );
      `);
    }

    // Delete existing admin user
    await db.run('DELETE FROM admins WHERE username = ?', ['admin']);
    console.log('Removed existing admin user...');

    // Create new admin user
    const hashedPassword = await bcrypt.hash('admin123', 12);
    await db.run(
      'INSERT INTO admins (username, email, password, role) VALUES (?, ?, ?, ?)',
      ['admin', 'admin@bchapel.com', hashedPassword, 'super_admin']
    );

    console.log('✅ Admin user reset successfully!');
    console.log('Username: admin');
    console.log('Password: admin123');

    // Verify the user was created
    const user = await db.get('SELECT * FROM admins WHERE username = ?', ['admin']);
    if (user) {
      console.log('✅ Admin user verified in database');
    }

    await db.close();
  } catch (error) {
    console.error('❌ Error resetting admin:', error);
  }
}

resetAdmin();