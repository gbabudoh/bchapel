const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const result = await prisma.banner.updateMany({
    where: {
      buttonText: 'Join Our Sunday Service'
    },
    data: {
      buttonUrl: 'http://localhost:3000/contact'
    }
  });

  console.log(`Updated ${result.count} banner(s).`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
