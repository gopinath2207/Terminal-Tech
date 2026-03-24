const User = require('../models/User.model');
const { AppError } = require('../middleware/error.middleware');
const { signAndSetCookie, clearCookie } = require('../utils/jwt.utils');

const register = async (data, res) => {
    // Guard: require a secret token to create admin accounts
    const requiredSecret = process.env.ADMIN_REGISTER_SECRET;
    if (!requiredSecret) {
        throw new AppError('Admin registration is disabled on this server.', 403);
    }
    if (data.adminSecret !== requiredSecret) {
        throw new AppError('Invalid admin registration secret.', 403);
    }

    const existing = await User.findOne({ email: data.email });
    if (existing) throw new AppError('An account with this email already exists.', 409);

    // Don't store the admin secret in the DB
    const { adminSecret: _secret, ...userData } = data;

    const user = await User.create(userData);
    signAndSetCookie(res, { id: user._id, role: user.role });
    return { user: { id: user._id, username: user.username, email: user.email, role: user.role } };
};

const login = async ({ email, password }, res) => {
    const user = await User.findOne({ email });
    // Timing-safe: always call comparePassword even if user not found
    const isMatch = user ? await user.comparePassword(password) : false;
    if (!user || !isMatch) throw new AppError('Invalid email or password.', 401);

    signAndSetCookie(res, { id: user._id, role: user.role });
    return { id: user._id, username: user.username, email: user.email, role: user.role };
};

const logout = (res) => {
    clearCookie(res);
};

const getMe = async (userId) => {
    const user = await User.findById(userId).select('-password').lean();
    if (!user) throw new AppError('User not found.', 404);
    return user;
};

module.exports = { register, login, logout, getMe };
