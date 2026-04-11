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
    const url = new URL(rawUrl);
    const cloud_name = url.hostname;
    const api_key = url.username;
    const api_secret = url.password;

    if (!cloud_name || !api_key || !api_secret) {
      throw new Error('Missing components in CLOUDINARY_URL');
    }

    cloudinary.config({ cloud_name, api_key, api_secret, secure: true });
    // console.log(`[cloudinary] Configured for cloud: ${cloud_name}`);
  } catch (err) {
    console.error('[cloudinary] Failed to parse CLOUDINARY_URL:', err instanceof Error ? err.message : err);
    
    // Fallback to manual parsing if URL constructor fails for non-standard schemes
    try {
      const withoutScheme = rawUrl.replace(/^cloudinary:\/\//, '');
      const lastAt = withoutScheme.lastIndexOf('@');
      if (lastAt !== -1) {
        const credentials = withoutScheme.slice(0, lastAt);
        const cloud_name  = withoutScheme.slice(lastAt + 1);
        const [api_key, api_secret] = credentials.split(':');
        cloudinary.config({ cloud_name, api_key, api_secret, secure: true });
      }
    } catch (e) {
      console.error('[cloudinary] Terminal config failure');
    }
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
        public_id: `${Date.now()}-${filename.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
        resource_type: 'auto',
        overwrite: false,
      },
      (error, result) => {
        if (error || !result) {
          console.error('[cloudinary] Upload execution error:', error);
          reject(error ?? new Error('Cloudinary upload reached terminal failure state.'));
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
