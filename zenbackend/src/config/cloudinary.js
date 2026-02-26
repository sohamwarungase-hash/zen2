import { v2 as cloudinarySDK } from 'cloudinary';

/**
 * Cloudinary configuration.
 * Reads credentials from .env:
 *   CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET
 */
cloudinarySDK.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Upload a file buffer to Cloudinary.
 *
 * @param {Buffer} buffer  — raw file bytes (from Multer memoryStorage)
 * @param {string} mimetype — e.g. "image/jpeg"
 * @returns {Promise<{ secure_url: string, public_id: string }>}
 */
async function uploadBuffer(buffer, mimetype) {
    return new Promise((resolve, reject) => {
        const stream = cloudinarySDK.uploader.upload_stream(
            {
                folder: 'mgs-complaints',
                resource_type: 'image',
            },
            (error, result) => {
                if (error) return reject(error);
                resolve(result);
            }
        );

        // Pipe the buffer into the upload stream
        stream.end(buffer);
    });
}

export default { uploadBuffer };
