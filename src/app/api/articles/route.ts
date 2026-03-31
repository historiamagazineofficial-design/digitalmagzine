import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';



export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    const slug = searchParams.get('slug');

    const where: any = {};
    if (category) where.category = { equals: category, mode: 'insensitive' };
    if (slug) where.slug = slug;

    // SECURITY: Authenticated users (admin) see everything. Public sees only 'Published'.
    const session = req.cookies.get('inkspire_session');
    const isAuthenticated = session?.value === 'authenticated';
    
    if (!isAuthenticated) {
      where.status = 'Published';
    }

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
      // Improved slugification: handle non-latin characters by only stripping certain symbols
      body.slug = (body.title || '')
        .toLowerCase()
        .trim()
        .replace(/[^\p{L}\p{N}]+/gu, '-') // Keep letters and numbers (Unicode aware)
        .replace(/(^-|-$)/g, '') || `article-${Date.now()}`;
    }

    // Prisma expects the exact model fields
    const article = await prisma.article.create({
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
        showOnHomepage: body.showOnHomepage !== undefined ? body.showOnHomepage : true,
      }
    });

    return NextResponse.json({ success: true, data: article }, { status: 201 });
  } catch (err: any) {
    console.error('[POST /api/articles]', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
