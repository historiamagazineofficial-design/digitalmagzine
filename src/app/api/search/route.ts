import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q')?.toLowerCase().trim();

  if (!q || q.length < 2) {
    return NextResponse.json({ results: [] });
  }

  try {
    const session = request.cookies.get('inkspire_session');
    const isAuthenticated = session?.value === 'authenticated';

    const { dbGetArticles } = await import('@/lib/server-db');
    const all = await dbGetArticles({ status: isAuthenticated ? 'all' : 'Published' });
    
    const results = all
      .filter((a: any) => 
        (
          a.title?.toLowerCase().includes(q) ||
          a.excerpt?.toLowerCase().includes(q) ||
          a.author?.toLowerCase().includes(q) ||
          a.content?.toLowerCase().includes(q) ||
          a.tags?.some((t: string) => t.toLowerCase().includes(q))
        )
      )
      .slice(0, 8)
      .map((a: any) => ({
        slug: a.slug,
        title: a.title,
        excerpt: a.excerpt,
        category: a.category,
        author: a.author,
      }));

    return NextResponse.json({ results });
  } catch {
    return NextResponse.json({ results: [] });
  }
}
