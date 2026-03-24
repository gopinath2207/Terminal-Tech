const multer = require('multer');
const { AppError } = require('./error.middleware');

// Keep images in memory so we can stream directly to Cloudinary
const storage = multer.memoryStorage();

const fileFilter = (_req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif'];
    if (allowed.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new AppError('Only image files are allowed (jpeg, png, webp, gif, avif).', 400), false);
    }
};

const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB max
});

module.exports = upload;
