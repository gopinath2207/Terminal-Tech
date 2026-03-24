require('dotenv').config();

// ── Startup environment validation ───────────────────────────────────────────
// Crash immediately if any required variable is missing — prevents silent failures
const REQUIRED_ENV = [
    'MONGO_URI',
    'JWT_SECRET',
    'CLOUDINARY_CLOUD_NAME',
    'CLOUDINARY_API_KEY',
    'CLOUDINARY_API_SECRET',
];
const missingEnv = REQUIRED_ENV.filter((key) => !process.env[key]);
if (missingEnv.length > 0) {
    console.error(`❌ Missing required environment variables: ${missingEnv.join(', ')}`);
    process.exit(1);
}
if (process.env.JWT_SECRET === 'changeme_secret' || process.env.JWT_SECRET.length < 32) {
    console.error('❌ JWT_SECRET is insecure. Use a 64-byte random hex string in production.');
    process.exit(1);
}

const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const compression = require('compression');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');

const connectDB = require('./config/db');
const { errorHandler } = require('./middleware/error.middleware');

// Routes
const authRoutes = require('./routes/auth.routes');
const postRoutes = require('./routes/post.routes');
const productRoutes = require('./routes/product.routes');
const affiliateRoutes = require('./routes/affiliate.routes');
const analyticsRoutes = require('./routes/analytics.routes');

const app = express();
const isProd = process.env.NODE_ENV === 'production';

// Connect to MongoDB
connectDB();

// ── Security Headers (Helmet) ─────────────────────────────────────────────────
app.use(
    helmet({
        contentSecurityPolicy: {
            directives: {
                defaultSrc: ["'self'"],
                scriptSrc: ["'self'"],
                styleSrc: ["'self'", "'unsafe-inline'"],  // needed for inline styles
                imgSrc: ["'self'", 'data:', 'https://res.cloudinary.com'],
                connectSrc: ["'self'"],
                fontSrc: ["'self'", 'https://fonts.gstatic.com'],
                objectSrc: ["'none'"],
                upgradeInsecureRequests: isProd ? [] : null,
            },
        },
        crossOriginEmbedderPolicy: false, // allow Cloudinary images
    })
);

// ── CORS ──────────────────────────────────────────────────────────────────────
const allowedOrigins = (process.env.CLIENT_URL || 'http://localhost:5173')
    .split(',')
    .map((o) => o.trim());

app.use(
    cors({
        origin: (origin, callback) => {
            // Allow requests with no origin (mobile apps, Postman, curl)
            if (!origin) return callback(null, true);
            if (allowedOrigins.includes(origin)) return callback(null, true);
            callback(new Error(`CORS: origin ${origin} not allowed`));
        },
        credentials: true,
    })
);

// ── Rate Limiting ─────────────────────────────────────────────────────────────
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 150,
    standardHeaders: true,
    legacyHeaders: false,
    message: { success: false, message: 'Too many requests, please slow down.' },
});
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10, // tighter: 10 login attempts per 15 minutes
    message: { success: false, message: 'Too many auth attempts, try again later.' },
    skipSuccessfulRequests: true, // only count failed attempts
});
const affiliateLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 30, // 30 redirect clicks per minute per IP
    message: { success: false, message: 'Too many redirect requests.' },
});

// ── Body Parsing & Compression ────────────────────────────────────────────────
app.use(compression());
app.use(express.json({ limit: '1mb' }));         // reduced from 10mb — JSON APIs don't need more
app.use(express.urlencoded({ extended: true, limit: '1mb' }));
app.use(cookieParser());

// ── NoSQL Injection Prevention ────────────────────────────────────────────────
app.use(mongoSanitize());   // strips $ and . from req.body, req.params, req.query

// ── Logging ───────────────────────────────────────────────────────────────────
if (!isProd) {
    app.use(morgan('dev'));
} else {
    app.use(morgan('combined')); // Apache Combined format — suitable for log aggregators
}

// ── Trust proxy (needed on Render/Railway/Vercel for req.ip) ──────────────────
if (isProd) {
    app.set('trust proxy', 1);
}

// ── Health Check ──────────────────────────────────────────────────────────────
app.get('/api/health', (_req, res) => {
    res.json({ success: true, status: 'ok', timestamp: new Date().toISOString() });
});

// ── Routes ────────────────────────────────────────────────────────────────────
app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/posts', apiLimiter, postRoutes);
app.use('/api/products', apiLimiter, productRoutes);
app.use('/go', affiliateLimiter, affiliateRoutes);  // rate-limited affiliate redirects
app.use('/api/analytics', apiLimiter, analyticsRoutes);

// ── 404 ───────────────────────────────────────────────────────────────────────
app.use((_req, res) => {
    res.status(404).json({ success: false, message: 'Route not found.' });
});

// ── Global Error Handler ──────────────────────────────────────────────────────
app.use(errorHandler);

// ── Start ─────────────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT} [${process.env.NODE_ENV || 'development'}]`);
});

module.exports = app;
