const { z } = require('zod');

const registerSchema = z.object({
    username: z.string().min(3).max(30).trim(),
    email: z.string().email().toLowerCase(),
    password: z
        .string()
        .min(8, 'Password must be at least 8 characters')
        .max(128, 'Password too long')
        .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
        .regex(/[0-9]/, 'Password must contain at least one number'),
    // Secret token required to register an admin account — set in .env
    adminSecret: z.string().min(1, 'Admin registration secret is required'),
});

const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(1, 'Password is required').max(128),
});

module.exports = { registerSchema, loginSchema };
