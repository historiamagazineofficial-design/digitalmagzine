import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    let settings = await prisma.siteSettings.findFirst();
    if (!settings) {
      settings = await prisma.siteSettings.create({
        data: {
          siteName: 'THE INKSPIRE',
          description: 'A Digital Magazine exploring faith, art, and history.',
          contactEmail: 'editor@theinkspire.com',
          primaryColor: '#07308D',
        },
      });
    }
    return NextResponse.json({ success: true, data: settings });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    let settings = await prisma.siteSettings.findFirst();
    
    const updateData = {
      siteName: body.siteName,
      description: body.description,
      contactEmail: body.contactEmail,
      socialTwitter: body.socialTwitter,
      socialInstagram: body.socialInstagram,
      primaryColor: body.primaryColor,
    };

    if (settings) {
      settings = await prisma.siteSettings.update({
        where: { id: settings.id },
        data: updateData,
      });
    } else {
      settings = await prisma.siteSettings.create({
        data: updateData,
      });
    }
    
    return NextResponse.json({ success: true, data: settings });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
