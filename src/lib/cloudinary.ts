/**
 * Cloudinary server-side utility
 *
 * Configuration is read automatically from the CLOUDINARY_URL environment
 * variable (format: cloudinary://api_key:api_secret@cloud_name).
 * No manual config call is needed — the SDK handles it.
 */
import { v2 as cloudinary } from 'cloudinary';

export default cloudinary;

/**
 * Upload a raw file Buffer to Cloudinary and return key metadata.
 */
export async function uploadToCloudinary(
  file: Buffer,
  filename: string,
  folder = 'the-historia'
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
