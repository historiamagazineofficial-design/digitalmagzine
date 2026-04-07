/**
 * Cloudinary server-side utility
 *
 * The Cloudinary v2 SDK does NOT auto-parse CLOUDINARY_URL in Next.js / ESM.
 * We must explicitly call cloudinary.config() with the parsed credentials.
 */
import { v2 as cloudinary } from 'cloudinary';

// Parse CLOUDINARY_URL manually.
// Format: cloudinary://api_key:api_secret@cloud_name
const rawUrl = process.env.CLOUDINARY_URL;
if (!rawUrl) {
  console.warn('[cloudinary] CLOUDINARY_URL is not set. Uploads will fail.');
} else {
  try {
    // Strip the scheme prefix so URL can be parsed
    const withoutScheme = rawUrl.replace(/^cloudinary:\/\//, '');
    // Split into credentials and cloud_name on the LAST '@'
    const lastAt = withoutScheme.lastIndexOf('@');
    const credentials = withoutScheme.slice(0, lastAt);   // api_key:api_secret
    const cloud_name  = withoutScheme.slice(lastAt + 1);  // cloud_name
    const [api_key, api_secret] = credentials.split(':');

    cloudinary.config({ cloud_name, api_key, api_secret, secure: true });
  } catch {
    console.error('[cloudinary] Failed to parse CLOUDINARY_URL.');
  }
}

export default cloudinary;

/**
 * Upload a raw file Buffer to Cloudinary and return key metadata.
 */
export async function uploadToCloudinary(
  file: Buffer,
  filename: string,
  folder = 'the-inkspire'
): Promise<{ url: string; publicId: string; bytes: number; format: string }> {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        public_id: `${Date.now()}-${filename.replace(/\.[^/.]+$/, '')}`,
        resource_type: 'auto',
        overwrite: false,
      },
      (error, result) => {
        if (error || !result) {
          reject(error ?? new Error('Cloudinary upload failed'));
        } else {
          resolve({
            url: result.secure_url,
            publicId: result.public_id,
            bytes: result.bytes,
            format: result.format,
          });
        }
      }
    );
    uploadStream.end(file);
  });
}

/**
 * Delete an asset from Cloudinary by its public_id.
 */
export async function deleteFromCloudinary(publicId: string): Promise<void> {
  await cloudinary.uploader.destroy(publicId, { resource_type: 'image' });
}
