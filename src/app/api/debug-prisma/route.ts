import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * GET /api/debug-prisma
 * Health-check: verifies the database connection is alive.
 * Returns article count and basic connectivity status.
 * Protected: only available in non-production environments.
 */
export async function GET() {
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({ error: 'Not available in production' }, { status: 403 });
  }

  try {
    const articleCount = await prisma.article.count();
    const mediaCount = await prisma.media.count();
    const voiceCount = await prisma.voice.count();

    return NextResponse.json({
      success: true,
      status: 'connected',
      database: 'Neon PostgreSQL',
      counts: {
        articles: articleCount,
        media: mediaCount,
        voices: voiceCount,
      },
    });
  } catch (err: any) {
    console.error('[debug-prisma] DB connection failed:', err);
    return NextResponse.json(
      { success: false, status: 'error', error: err.message },
      { status: 500 }
    );
  }
}
