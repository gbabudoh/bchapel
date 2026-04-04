const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const homepage = await prisma.homepageContent.findMany();
  console.log('Homepage content count:', homepage.length);
  homepage.forEach(h => console.log(`  [${h.section}] ${h.title} | isActive: ${h.isActive} | imageUrl: ${h.imageUrl ? 'YES' : 'NO'}`));

  const events = await prisma.event.findMany();
  console.log('\nEvents count:', events.length);
  events.forEach(e => console.log(`  ${e.title} | isActive: ${e.isActive} | isFeatured: ${e.isFeatured} | imageUrl: ${e.imageUrl ? 'YES' : 'NO'}`));

  const nav = await prisma.navigation.findMany();
  console.log('\nNavigation count:', nav.length);
  nav.forEach(n => console.log(`  ${n.title} | isActive: ${n.isActive} | url: ${n.url}`));

  const footer = await prisma.footerItem.findMany();
  console.log('\nFooter items count:', footer.length);
  footer.forEach(f => console.log(`  [${f.section}] ${f.title} | isActive: ${f.isActive}`));

  await prisma.$disconnect();
}

main().catch(e => {
  console.error('Error:', e.message);
  prisma.$disconnect();
});
