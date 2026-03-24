const { verifyToken } = require('../utils/jwt.utils');
const { AppError } = require('./error.middleware');
const User = require('../models/User.model');

/**
 * Reads JWT from HttpOnly cookie, verifies it, and attaches user to req.
 */
const protect = async (req, _res, next) => {
    try {
        const token = req.cookies?.token;
        if (!token) throw new AppError('Not authenticated. Please log in.', 401);

        const decoded = verifyToken(token);
        const user = await User.findById(decoded.id).select('-password').lean();
        if (!user) throw new AppError('User belonging to this token no longer exists.', 401);

        req.user = user;
        next();
    } catch (err) {
        next(err);
    }
};

/**
 * Restrict access to specific roles.
 */
const restrictTo = (...roles) => {
    return (req, _res, next) => {
        if (!roles.includes(req.user?.role)) {
            return next(new AppError('You do not have permission to perform this action.', 403));
        }
        next();
    };
};

module.exports = { protect, restrictTo };
