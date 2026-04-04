const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function resetAdmin() {
  try {
    console.log('Connected to database...');

    // Delete existing admin user
    await prisma.admin.deleteMany({
      where: { username: 'admin' }
    });
    console.log('Removed existing admin user...');

    // Create new admin user
    const hashedPassword = await bcrypt.hash('admin123', 12);
    await prisma.admin.create({
      data: {
        username: 'admin',
        email: 'admin@bchapel.com',
        password: hashedPassword,
        role: 'super_admin'
      }
    });

    console.log('✅ Admin user reset successfully!');
    console.log('Username: admin');
    console.log('Password: admin123');

    // Verify the user was created
    const user = await prisma.admin.findUnique({
      where: { username: 'admin' }
    });
    if (user) {
      console.log('✅ Admin user verified in database');
    }

  } catch (error) {
    console.error('❌ Error resetting admin:', error);
  } finally {
    await prisma.$disconnect();
  }
}

resetAdmin();
