import { openDb } from '../database.js';

export async function createDonationsTable() {
  const db = await openDb();
  
  // Drop existing table if it exists to avoid conflicts
  await db.exec(`DROP TABLE IF EXISTS donations;`);
  
  await db.exec(`
    CREATE TABLE donations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      amount DECIMAL(10,2) NOT NULL,
      type TEXT DEFAULT 'one-time',
      status TEXT DEFAULT 'pending',
      transaction_id TEXT,
      donor_email TEXT,
      donor_name TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
    
    CREATE INDEX IF NOT EXISTS idx_donations_transaction_id ON donations(transaction_id);
    CREATE INDEX IF NOT EXISTS idx_donations_donor_email ON donations(donor_email);
    CREATE INDEX IF NOT EXISTS idx_donations_created_at ON donations(created_at);
  `);
  
  console.log('Donations table created successfully');
}

// Run this migration
createDonationsTable().catch(console.error);