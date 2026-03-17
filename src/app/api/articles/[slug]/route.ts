import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const slug = decodeURIComponent((await params).slug);
    const article = await prisma.article.findUnique({
      where: { slug },
    });

    if (!article) {
      return NextResponse.json({ success: false, error: 'Article not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: article });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const slug = decodeURIComponent((await params).slug);
    const body = await req.json();

    // Build a strictly typed update payload — only known Article model fields.
    const updateData: {
      title?: string; excerpt?: string; content?: string;
      category?: string; author?: string; authorImage?: string;
      authorBio?: string; date?: string; imageUrl?: string;
      readingTime?: string; status?: string; tags?: string[];
      showOnHomepage?: boolean;
    } = {};

    if ('title'          in body) updateData.title          = body.title;
    if ('excerpt'        in body) updateData.excerpt        = body.excerpt;
    if ('content'        in body) updateData.content        = body.content;
    if ('category'       in body) updateData.category       = body.category;
    if ('type'           in body) updateData.category       = body.type; // Map UI 'type' to DB 'category'
    if ('author'         in body) updateData.author         = body.author;
    if ('authorImage'    in body) updateData.authorImage    = body.authorImage;
    if ('authorBio'      in body) updateData.authorBio      = body.authorBio;
    if ('date'           in body) updateData.date           = body.date;
    if ('imageUrl'       in body) updateData.imageUrl       = body.imageUrl;
    if ('readingTime'    in body) updateData.readingTime    = body.readingTime;
    if ('status'         in body) updateData.status         = body.status;
    if ('tags'           in body) updateData.tags           = body.tags;
    if ('showOnHomepage' in body) updateData.showOnHomepage = Boolean(body.showOnHomepage);

    const article = await prisma.article.update({
      where: { slug },
      data: updateData,
    });

    return NextResponse.json({ success: true, data: article });
  } catch (err: any) {
    console.error('[PUT /api/articles/:slug] error:', err.message, err.code ?? '');
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}


export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const slug = decodeURIComponent((await params).slug);
    await prisma.article.delete({
      where: { slug },
    });

    return NextResponse.json({ success: true, message: 'Article deleted' });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
