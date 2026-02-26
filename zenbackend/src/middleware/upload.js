import multer from 'multer';

/**
 * Multer middleware for handling multipart image uploads.
 *
 * Rules (per spec):
 *   - In-memory storage (buffer passed to Cloudinary)
 *   - 5 MB hard file-size cap
 *   - Only image/jpeg, image/png, image/webp accepted
 */
const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

const upload = multer({
    storage: multer.memoryStorage(),

    limits: {
        fileSize: 5 * 1024 * 1024, // 5 MB
    },

    fileFilter(_req, file, cb) {
        if (ALLOWED_MIME_TYPES.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(
                new Error(
                    `Unsupported file type: ${file.mimetype}. ` +
                    `Allowed types: ${ALLOWED_MIME_TYPES.join(', ')}`
                ),
                false
            );
        }
    },
});

export default upload;
