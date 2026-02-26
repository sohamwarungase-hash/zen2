const fs = require('fs/promises');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

/**
 * Storage Abstraction Layer
 * Supports Local FS or Cloudinary (placeholder) for Phase-1
 */
class StorageService {
    constructor() {
        this.storageType = process.env.STORAGE_TYPE || 'local';
        this.uploadDir = path.join(process.cwd(), 'uploads');
    }

    async uploadPhoto(buffer, filenamePrefix) {
        if (this.storageType === 'local') {
            return this._uploadToLocal(buffer, filenamePrefix);
        } else {
            // Placeholder for Cloud Storage (S3 / Cloudinary)
            // return this._uploadToCloud(buffer, filenamePrefix);
            console.warn('[STORAGE] Cloud storage selected but not fully implemented, falling back to local');
            return this._uploadToLocal(buffer, filenamePrefix);
        }
    }

    async _uploadToLocal(buffer, filenamePrefix) {
        try {
            // Ensure directory exists
            await fs.mkdir(this.uploadDir, { recursive: true });

            const fileName = `${filenamePrefix}-${uuidv4()}.jpg`;
            const filePath = path.join(this.uploadDir, fileName);

            await fs.writeFile(filePath, buffer);

            // Return public URL (assumes Express static middleware is serving /uploads)
            return `/uploads/${fileName}`;
        } catch (error) {
            console.error('[STORAGE_ERROR]: Local write failed', error);
            throw new Error('Failed to save file locally');
        }
    }

    async _uploadToCloud(buffer, filenamePrefix) {
        // Implement S3 or Cloudinary here in Phase-2
        throw new Error('Cloud storage implementation missing');
    }
}

module.exports = new StorageService();
