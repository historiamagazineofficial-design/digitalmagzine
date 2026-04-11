
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const articles = await prisma.article.findMany({
    select: {
      slug: true,
      title: true,
      status: true
    }
  });
  console.log('Articles status counts:');
  const counts = articles.reduce((acc, a) => {
    acc[a.status] = (acc[a.status] || 0) + 1;
    return acc;
  }, {});
  console.log(counts);
  
  const failedArticles = articles.filter(a => a.status.toLowerCase().includes('fail'));
  if (failedArticles.length > 0) {
    console.log('Articles with fail status:');
    console.log(failedArticles);
  } else {
    console.log('No articles with "fail" status found.');
  }

  const comments = await prisma.comment.findMany();
  const cCounts = comments.reduce((acc, c) => {
    acc[c.status] = (acc[c.status] || 0) + 1;
    return acc;
  }, {});
  console.log('Comments status counts:', cCounts);

  const media = await prisma.media.findMany();
  console.log('Total media items:', media.length);
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
