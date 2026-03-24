const authService = require('../services/auth.service');
const api = require('../utils/apiResponse.utils');

const register = async (req, res, next) => {
    try {
        const result = await authService.register(req.body, res);
        api.created(res, result, 'Account created successfully.');
    } catch (err) {
        next(err);
    }
};

const login = async (req, res, next) => {
    try {
        const user = await authService.login(req.body, res);
        api.success(res, { user }, 'Logged in successfully.');
    } catch (err) {
        next(err);
    }
};

const logout = (_req, res) => {
    authService.logout(res);
    api.success(res, null, 'Logged out successfully.');
};

const getMe = async (req, res, next) => {
    try {
        const user = await authService.getMe(req.user._id);
        api.success(res, { user });
    } catch (err) {
        next(err);
    }
};

module.exports = { register, login, logout, getMe };
