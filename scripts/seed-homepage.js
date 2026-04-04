const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Seeding homepage content and events...');

  // Seed Homepage Content
  const homepageExists = await prisma.homepageContent.findFirst();
  if (!homepageExists) {
    await prisma.homepageContent.createMany({
      data: [
        {
          section: 'welcome',
          title: 'A Place of Faith & Community',
          content: 'Battersea Chapel is a warm and welcoming Christian community nestled in the heart of Battersea. For generations, we have been a place where people come together to worship, grow in faith, and support one another through life\'s journey. Whether you are a long-time believer or just exploring, you are welcome here.',
          imageUrl: 'https://images.unsplash.com/photo-1438232992991-995b7058bbb3?w=800&q=80',
          buttonText: 'Learn More About Us',
          buttonUrl: '/about',
          orderIndex: 1,
          isActive: true
        },
        {
          section: 'welcome',
          title: 'Growing Together in Grace',
          content: 'Our mission is to share the love of Christ with everyone we meet. Through worship, fellowship, and service, we aim to build a community that reflects God\'s grace and compassion. Join us on this journey of faith and discover the joy of belonging to a loving church family.',
          imageUrl: 'https://images.unsplash.com/photo-1529070538774-1843cb3265df?w=800&q=80',
          buttonText: 'Join Our Community',
          buttonUrl: '/community',
          orderIndex: 2,
          isActive: true
        },
        {
          section: 'services',
          title: 'Sunday Worship',
          content: 'Join us every Sunday for uplifting worship services filled with praise, prayer, and an inspiring message from God\'s Word. Services begin at 10:30 AM.',
          orderIndex: 1,
          isActive: true
        },
        {
          section: 'services',
          title: 'Bible Study',
          content: 'Deepen your understanding of Scripture through our weekly Bible study groups. We explore God\'s Word together in a warm and welcoming environment.',
          orderIndex: 2,
          isActive: true
        },
        {
          section: 'services',
          title: 'Prayer Meeting',
          content: 'Come together in prayer with our community. We believe in the power of prayer and welcome all to join us as we lift our hearts to God.',
          orderIndex: 3,
          isActive: true
        }
      ]
    });
    console.log('✅ Created homepage content (welcome + services sections)');
  } else {
    console.log('⏭️  Homepage content already exists, skipping');
  }

  // Seed Events
  const eventsExist = await prisma.event.findFirst();
  if (!eventsExist) {
    await prisma.event.createMany({
      data: [
        {
          title: 'Sunday Morning Worship',
          description: 'Join us for our weekly Sunday morning worship service. Experience uplifting music, heartfelt prayer, and an inspiring sermon. Everyone is welcome to attend.',
          date: '2026-04-06',
          location: 'Battersea Chapel Main Hall',
          imageUrl: 'https://images.unsplash.com/photo-1507692049790-de58290a4334?w=800&q=80',
          isFeatured: true,
          isActive: true
        },
        {
          title: 'Easter Celebration Service',
          description: 'Celebrate the resurrection of our Lord Jesus Christ with a special Easter service. There will be worship, choir performances, and a community fellowship lunch afterwards.',
          date: '2026-04-20',
          location: 'Battersea Chapel Main Hall',
          imageUrl: 'https://images.unsplash.com/photo-1457301547464-18ce4f4bac0b?w=800&q=80',
          isFeatured: true,
          isActive: true
        },
        {
          title: 'Community Outreach Day',
          description: 'Join us as we serve our local community through various outreach activities. From food distribution to neighbourhood clean-up, there are plenty of ways to get involved and make a difference.',
          date: '2026-04-27',
          location: 'Battersea Community Centre',
          imageUrl: 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=800&q=80',
          isFeatured: true,
          isActive: true
        },
        {
          title: 'Youth Fellowship Night',
          description: 'A special evening for young people to come together for fellowship, games, worship, and meaningful conversations about faith and life.',
          date: '2026-05-03',
          location: 'Battersea Chapel Youth Hall',
          isFeatured: false,
          isActive: true
        }
      ]
    });
    console.log('✅ Created events data');
  } else {
    console.log('⏭️  Events already exist, skipping');
  }

  // Seed more Footer items if only 2 exist
  const footerCount = await prisma.footerItem.count();
  if (footerCount < 5) {
    // Delete existing minimal footer items and re-seed with comprehensive ones
    await prisma.footerItem.deleteMany();
    await prisma.footerItem.createMany({
      data: [
        { section: 'links', title: 'Home', url: '/', orderIndex: 1, isActive: true },
        { section: 'links', title: 'About Us', url: '/about', orderIndex: 2, isActive: true },
        { section: 'links', title: 'Events', url: '/events', orderIndex: 3, isActive: true },
        { section: 'links', title: 'Leadership', url: '/leadership', orderIndex: 4, isActive: true },
        { section: 'links', title: 'Community', url: '/community', orderIndex: 5, isActive: true },
        { section: 'links', title: 'Giving', url: '/giving', orderIndex: 6, isActive: true },
        { section: 'contact', title: 'Battersea Chapel, London', icon: 'mappin', orderIndex: 1, isActive: true },
        { section: 'contact', title: 'info@batterseachapel.com', url: 'mailto:info@batterseachapel.com', icon: 'mail', orderIndex: 2, isActive: true },
        { section: 'contact', title: '+44 20 7350 0000', url: 'tel:+442073500000', icon: 'phone', orderIndex: 3, isActive: true },
        { section: 'social', title: 'Facebook', url: 'https://facebook.com/batterseachapel', icon: 'facebook', orderIndex: 1, isActive: true },
        { section: 'social', title: 'Instagram', url: 'https://instagram.com/batterseachapel', icon: 'instagram', orderIndex: 2, isActive: true },
        { section: 'social', title: 'YouTube', url: 'https://youtube.com/batterseachapel', icon: 'youtube', orderIndex: 3, isActive: true },
      ]
    });
    console.log('✅ Updated footer items with full content');
  } else {
    console.log('⏭️  Footer items look complete, skipping');
  }

  console.log('\n🎉 Seeding completed!');
  await prisma.$disconnect();
}

main().catch(e => {
  console.error('Error:', e.message);
  prisma.$disconnect();
  process.exit(1);
});
