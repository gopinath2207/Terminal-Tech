/**
 * Global error handling middleware – must be the last app.use() call.
 * In production: never expose stack traces or internal error details.
 */
const errorHandler = (err, _req, res, _next) => {
    const isProd = process.env.NODE_ENV === 'production';

    // Always log full error server-side (for monitoring tools)
    if (!isProd) {
        console.error(`[ERROR] ${err.message}`, err.stack);
    } else {
        console.error(`[ERROR] ${err.message}`);
    }

    // Mongoose duplicate key (e.g. unique slug)
    if (err.code === 11000) {
        const field = Object.keys(err.keyValue || {})[0] || 'field';
        return res.status(409).json({
            success: false,
            message: `Duplicate value for ${field}. Please use a different value.`,
        });
    }

    // Mongoose validation error
    if (err.name === 'ValidationError') {
        const messages = Object.values(err.errors).map((e) => e.message);
        return res.status(400).json({ success: false, message: messages.join(', ') });
    }

    // JWT errors — do not reveal details
    if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
        return res.status(401).json({ success: false, message: 'Invalid or expired session. Please log in again.' });
    }

    // Multer errors
    if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(413).json({ success: false, message: 'File too large. Maximum size is 5 MB.' });
    }

    const statusCode = err.statusCode || err.status || 500;

    // In production, hide internal 500 error messages from the client
    const message = isProd && statusCode === 500
        ? 'An unexpected error occurred. Please try again later.'
        : (err.message || 'Internal Server Error');

    res.status(statusCode).json({ success: false, message });
};

/**
 * Helper to create structured errors with HTTP status codes.
 */
class AppError extends Error {
    constructor(message, statusCode = 500) {
        super(message);
        this.statusCode = statusCode;
        this.name = 'AppError';
    }
}

module.exports = { errorHandler, AppError };
