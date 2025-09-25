// Migration to add contact-related tables
export async function up(db) {
  // Contact information table
  await db.exec(`
    CREATE TABLE IF NOT EXISTS contact_info (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      type TEXT NOT NULL,
      label TEXT NOT NULL,
      value TEXT NOT NULL,
      icon TEXT,
      is_active BOOLEAN DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Contact messages table
  await db.exec(`
    CREATE TABLE IF NOT EXISTS contact_messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      subject TEXT,
      message TEXT NOT NULL,
      is_read BOOLEAN DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Insert default contact information
  const contactExists = await db.get('SELECT id FROM contact_info LIMIT 1');
  if (!contactExists) {
    await db.run(`
      INSERT INTO contact_info (type, label, value, icon, is_active) VALUES
      ('address', 'Church Address', '123 Chapel Street, Battersea, London SW11 1AA', 'MapPin', 1),
      ('phone', 'Phone Number', '+44 20 7123 4567', 'Phone', 1),
      ('email', 'Email Address', 'info@batterseachapel.org', 'Mail', 1),
      ('hours', 'Service Times', 'Sunday: 10:00 AM & 6:00 PM', 'Clock', 1)
    `);
  }
}

export async function down(db) {
  await db.exec('DROP TABLE IF EXISTS contact_info');
  await db.exec('DROP TABLE IF EXISTS contact_messages');
}