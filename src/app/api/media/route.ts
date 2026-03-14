import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const media = await (prisma as any).media.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json({ success: true, data: media });
  } catch (err: any) {
    console.error('MEDIA_GET_ERROR:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.url) {
      return NextResponse.json({ success: false, error: 'URL is required' }, { status: 400 });
    }

    const media = await (prisma as any).media.create({
      data: {
        url: body.url,
        name: body.name || body.url.split('/').pop()?.split('?')[0] || 'unnamed-asset',
        size: body.size || '0 MB',
      },
    });
    return NextResponse.json({ success: true, data: media }, { status: 201 });
  } catch (err: any) {
    console.error('MEDIA_POST_ERROR:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
