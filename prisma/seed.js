const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Create default admin user
  const adminExists = await prisma.admin.findUnique({
    where: { username: 'admin' }
  });

  if (!adminExists) {
    const hashedPassword = await bcrypt.hash('admin123', 12);
    await prisma.admin.create({
      data: {
        username: 'admin',
        email: 'admin@bchapel.com',
        password: hashedPassword,
        role: 'super_admin'
      }
    });
    console.log('Created default admin user');
  }

  // Create default navigation items
  const navExists = await prisma.navigation.findFirst();
  if (!navExists) {
    await prisma.navigation.createMany({
      data: [
        { title: 'Home', url: '/', orderIndex: 1, isActive: true },
        { title: 'About', url: '/about', orderIndex: 2, isActive: true },
        { title: 'Events', url: '/events', orderIndex: 3, isActive: true },
        { title: 'Leadership', url: '/leadership', orderIndex: 4, isActive: true },
        { title: 'Community', url: '/community', orderIndex: 5, isActive: true },
        { title: 'Giving', url: '/giving', orderIndex: 6, isActive: true },
        { title: 'Contact', url: '/contact', orderIndex: 7, isActive: true }
      ]
    });
    console.log('Created default navigation items');
  }

  // Create default footer items
  const footerExists = await prisma.footerItem.findFirst();
  if (!footerExists) {
    await prisma.footerItem.createMany({
      data: [
        { section: 'quick-links', title: 'Home', url: '/', icon: 'Home', orderIndex: 1, isActive: true },
        { section: 'quick-links', title: 'About Us', url: '/about', icon: 'Info', orderIndex: 2, isActive: true },
        { section: 'quick-links', title: 'Events', url: '/events', icon: 'Calendar', orderIndex: 3, isActive: true },
        { section: 'quick-links', title: 'Contact', url: '/contact', icon: 'Mail', orderIndex: 4, isActive: true },
        { section: 'ministries', title: 'Youth Ministry', url: '/community', icon: 'Users', orderIndex: 1, isActive: true },
        { section: 'ministries', title: "Children's Church", url: '/community', icon: 'Baby', orderIndex: 2, isActive: true },
        { section: 'ministries', title: "Women's Fellowship", url: '/community', icon: 'Heart', orderIndex: 3, isActive: true },
        { section: 'ministries', title: "Men's Ministry", url: '/community', icon: 'Users', orderIndex: 4, isActive: true }
      ]
    });
    console.log('Created default footer items');
  }


  // Create default giving options
  const givingExists = await prisma.givingOption.findFirst();
  if (!givingExists) {
    await prisma.givingOption.createMany({
      data: [
        { 
          title: 'Tithe', 
          description: 'Support the ongoing ministry and operations of our church', 
          suggestedAmounts: JSON.stringify([25, 50, 100, 250]), 
          isActive: true 
        },
        { 
          title: 'Offering', 
          description: 'Special offerings for missions and community outreach', 
          suggestedAmounts: JSON.stringify([20, 40, 75, 150]), 
          isActive: true 
        },
        { 
          title: 'Support Fund', 
          description: 'Help us maintain and improve our church facilities', 
          suggestedAmounts: JSON.stringify([50, 100, 200, 500]), 
          isActive: true 
        }
      ]
    });
    console.log('Created default giving options');
  }

  // Create default SEO settings
  const seoExists = await prisma.seoSettings.findFirst();
  if (!seoExists) {
    await prisma.seoSettings.create({
      data: {
        siteTitle: 'Battersea Chapel - A Place of Worship, Community & Faith',
        siteDescription: 'Welcome to Battersea Chapel - A vibrant Christian community in London offering worship services, community programs, and spiritual growth opportunities for all ages.',
        siteKeywords: 'Battersea Chapel,Church London,Christian Community,Worship Services,Bible Study,Community Programs,Faith,Prayer,Sunday Service,London Church',
        siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
        ogImage: '/og-image.jpg',
        contactEmail: 'admin@batterseachapel.com'
      }
    });
    console.log('Created default SEO settings');
  }

  console.log('Seeding completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
