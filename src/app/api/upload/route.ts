import { NextRequest, NextResponse } from 'next/server';
import { uploadToCloudinary } from '@/lib/cloudinary';
import { prisma } from '@/lib/prisma';

// Disable the default Next.js body parser so we can read the raw stream
export const runtime = 'nodejs';
export const maxDuration = 60; // Allow more time for large uploads

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No file provided' },
        { status: 400 }
      );
    }

    console.log(`[UPLOAD] Starting: ${file.name}, Size: ${(file.size / 1024 / 1024).toFixed(2)} MB`);

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { success: false, error: 'Only image files are allowed (JPEG, PNG, WebP, GIF, SVG).' },
        { status: 400 }
      );
    }

    // Convert File to Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload to Cloudinary
    const { url, publicId, bytes } = await uploadToCloudinary(
      buffer,
      file.name,
      'the-inkspire'
    );

    // Format size as human-readable
    const sizeInMB = (bytes / (1024 * 1024)).toFixed(2);
    const size = `${sizeInMB} MB`;

    // Save to database
    const media = await prisma.media.create({
      data: {
        url,
        name: file.name,
        size,
        publicId,
      },
    });

    return NextResponse.json({ success: true, data: media }, { status: 201 });
  } catch (err) {
    console.error('UPLOAD_ERROR:', err);
    return NextResponse.json(
      { success: false, error: err instanceof Error ? err.message : 'Upload failed' },
      { status: 500 }
    );
  }
}
