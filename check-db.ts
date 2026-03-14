
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  const articles = await prisma.article.findMany()
  console.log('Articles found:', articles.length)
  articles.forEach(a => console.log(`- ${a.title} (${a.slug})`))
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect())
