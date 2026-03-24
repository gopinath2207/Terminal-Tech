const cloudinary = require('../config/cloudinary');
const { AppError } = require('../middleware/error.middleware');

const FOLDER = process.env.CLOUDINARY_FOLDER || 'affiliateblog';

/**
 * Upload a buffer to Cloudinary with auto format + quality optimisation.
 * Returns { url, publicId }.
 */
const uploadImage = (buffer, folder = FOLDER) => {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            {
                folder,
                transformation: [{ fetch_format: 'auto', quality: 'auto', width: 1200, crop: 'limit' }],
                resource_type: 'image',
            },
            (error, result) => {
                if (error) return reject(new AppError(`Cloudinary upload failed: ${error.message}`, 500));
                resolve({ url: result.secure_url, publicId: result.public_id });
            }
        );
        uploadStream.end(buffer);
    });
};

/**
 * Delete an image from Cloudinary by publicId.
 */
const deleteImage = async (publicId) => {
    if (!publicId) return;
    try {
        await cloudinary.uploader.destroy(publicId);
    } catch (err) {
        console.error(`Cloudinary delete failed for ${publicId}: ${err.message}`);
        // Non-fatal — log and continue
    }
};

module.exports = { uploadImage, deleteImage };
