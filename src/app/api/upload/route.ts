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
    const allowedTypes = [
      'image/jpeg', 
      'image/jpg', 
      'image/png', 
      'image/webp', 
      'image/gif', 
      'image/svg+xml'
    ];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { success: false, error: `Type "${file.type}" not allowed. Only JPEG, PNG, WebP, GIF, SVG.` },
        { status: 400 }
      );
    }

    // Convert File to Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload to Cloudinary
    console.log(`[UPLOAD] Processing through Cloudinary SDK for: ${file.name}`);
    const { url, publicId, bytes } = await uploadToCloudinary(
      buffer,
      file.name,
      'the-inkspire'
    );

    console.log(`[UPLOAD] Cloudinary Response: ${publicId}`);

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
    console.error('[CRITICAL_UPLOAD_FAILURE]:', err);
    // Explicitly handle common Cloudinary error strings if they appeared in logs
    const errorMessage = err instanceof Error ? err.message : String(err);
    
    return NextResponse.json(
      { 
        success: false, 
        error: errorMessage,
        tip: 'Check your file size (under 10MB) and CLOUDINARY_URL format.'
      },
      { status: 500 }
    );
  }
}
