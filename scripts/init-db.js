const { openDb } = require('../lib/database');

async function initializeDatabase() {
  try {
    console.log('Initializing database...');
    const db = await openDb();
    
    // Check if navigation table exists
    const tableExists = await db.get(
      "SELECT name FROM sqlite_master WHERE type='table' AND name='navigation'"
    );
    
    console.log('Navigation table exists:', !!tableExists);
    
    if (tableExists) {
      const navigationItems = await db.all('SELECT * FROM navigation');
      console.log('Navigation items:', navigationItems);
    }
    
    // Check if footer_items table exists
    const footerTableExists = await db.get(
      "SELECT name FROM sqlite_master WHERE type='table' AND name='footer_items'"
    );
    
    console.log('Footer items table exists:', !!footerTableExists);
    
    if (footerTableExists) {
      const footerItems = await db.all('SELECT * FROM footer_items');
      console.log('Footer items:', footerItems);
    }
    
    console.log('Database initialization complete');
    process.exit(0);
  } catch (error) {
    console.error('Database initialization error:', error);
    process.exit(1);
  }
}

initializeDatabase();
