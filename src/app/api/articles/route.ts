import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Seed data for first-run
const SEED_ARTICLES = [
  {
    slug: 'architecture-of-silence',
    title: 'The Architecture of Silence: Finding Stillness in the Modern Age',
    excerpt: 'An exploration into how traditional Islamic geometric patterns invoke a sense of contemplation and inner peace amidst relentless digital noise.',
    content: `<p class="mb-8"><span class="float-left text-7xl leading-none pr-3 pt-2 font-serif font-bold" style="color:#ec5b13">I</span>n the relentless cadence of modernity, silence is often misconstrued as an absence.</p>`,
    category: 'Articles',
    author: 'Dr. Ayesha Rahman',
    date: 'March 15, 2026',
    imageUrl: 'https://images.unsplash.com/photo-1542385151-efd9000785a0?q=80&w=2574&auto=format&fit=crop',
    readingTime: '5 min read',
    status: 'Published',
    tags: ['#Theology', '#Sufism'],
  },
  {
    slug: 'echoes-of-andalusia',
    title: 'Echoes of Andalusia: Poetry in Exile',
    excerpt: 'A breathtaking collection of verses exploring themes of longing, memory, and the spiritual dimensions of displacement.',
    content: `<p class="mb-8">The gardens of Cordoba bloom no more, yet in the heart, their fragrance lingers.</p>`,
    category: 'Fiction',
    author: 'Fatima Al-Zahra',
    date: 'March 12, 2026',
    imageUrl: 'https://images.unsplash.com/photo-1510525009512-ad7fc13eefab?q=80&w=2574&auto=format&fit=crop',
    readingTime: '3 min read',
    status: 'Published',
    tags: ['#Literature', '#Poetry'],
  },
];

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    const slug = searchParams.get('slug');

    // Auto-seed if empty
    const count = await prisma.article.count();
    if (count === 0) {
      console.log('Postgres: Auto-seeding articles...');
      for (const art of SEED_ARTICLES) {
        await prisma.article.create({ data: art });
      }
    }

    const where: any = {};
    if (category) where.category = { equals: category, mode: 'insensitive' };
    if (slug) where.slug = slug;

    const articles = await prisma.article.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ success: true, data: articles });
  } catch (err: any) {
    console.error('[GET /api/articles]', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body.slug) {
      body.slug = body.title
        ?.toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '') || `article-${Date.now()}`;
    }

    // Prisma expects the exact model fields
    const article = await (prisma as any).article.create({
      data: {
        slug: body.slug,
        title: body.title,
        excerpt: body.excerpt || '',
        content: body.content || '',
        category: body.category || 'Articles',
        author: body.author || 'Anonymous',
        authorImage: body.authorImage || '',
        authorBio: body.authorBio || '',
        date: body.date || '',
        imageUrl: body.imageUrl || '',
        readingTime: body.readingTime || '5 min read',
        status: body.status || 'Draft',
        tags: body.tags || [],
      }
    });

    return NextResponse.json({ success: true, data: article }, { status: 201 });
  } catch (err: any) {
    console.error('[POST /api/articles]', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
