const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const banners = await prisma.banner.findMany();
  console.log('Total banners:', banners.length);
  console.log(JSON.stringify(banners, null, 2));
  await prisma.$disconnect();
}

main().catch(e => {
  console.error('Error:', e.message);
  prisma.$disconnect();
});
