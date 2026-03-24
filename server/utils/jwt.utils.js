const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';
const COOKIE_MAX_AGE = 7 * 24 * 60 * 60 * 1000; // 7 days in ms
const isProd = process.env.NODE_ENV === 'production';

/**
 * Signs a JWT and sets it as an HttpOnly cookie on the response.
 */
const signAndSetCookie = (res, payload) => {
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
    res.cookie('token', token, {
        httpOnly: true,                    // JS cannot read the cookie — XSS safe
        secure: isProd,                    // HTTPS only in production
        sameSite: isProd ? 'none' : 'lax', // 'none' needed when API and frontend are on different domains
        maxAge: COOKIE_MAX_AGE,
        path: '/',
    });
    return token;
};

/**
 * Verifies a JWT string and returns decoded payload. Throws on invalid/expired.
 */
const verifyToken = (token) => {
    return jwt.verify(token, JWT_SECRET);
};

/**
 * Clears the auth cookie with matching attributes.
 */
const clearCookie = (res) => {
    res.clearCookie('token', {
        httpOnly: true,
        secure: isProd,
        sameSite: isProd ? 'none' : 'lax',
        path: '/',
    });
};

module.exports = { signAndSetCookie, verifyToken, clearCookie };
