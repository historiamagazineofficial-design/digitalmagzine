import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const voices = await prisma.voice.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json({ success: true, data: voices });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const voice = await prisma.voice.create({
      data: {
        contributor: body.contributor,
        role: body.role || '',
        quote: body.quote || '',
        imageUrl: body.imageUrl || '',
      },
    });
    return NextResponse.json({ success: true, data: voice }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
