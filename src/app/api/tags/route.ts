import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    let store = await prisma.tagStore.findFirst();
    if (!store) {
      store = await prisma.tagStore.create({
        data: { tags: ['#History', '#Theology', '#Philosophy', '#Literature', '#Poetry'] },
      });
    }
    return NextResponse.json({ success: true, data: store.tags });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const { tags } = await req.json();
    let store = await prisma.tagStore.findFirst();
    
    if (store) {
      store = await prisma.tagStore.update({
        where: { id: store.id },
        data: { tags },
      });
    } else {
      store = await prisma.tagStore.create({
        data: { tags },
      });
    }
    
    return NextResponse.json({ success: true, data: store.tags });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
