const { z } = require('zod');

// Helper: preprocess JSON string arrays sent via multipart/form-data
const jsonStringArray = (schema) =>
    z.preprocess((v) => {
        if (typeof v === 'string') {
            try { return JSON.parse(v); } catch { return []; }
        }
        return v;
    }, schema);

// Helper: coerce "true"/"false" strings to booleans
const coercedBool = z
    .preprocess((v) => v === 'true' || v === true, z.boolean())
    .optional()
    .default(false);

const createPostSchema = z.object({
    title: z.string().min(3).max(200).trim(),
    excerpt: z.string().min(10).max(400).trim(),
    content: z.string().min(20),
    category: z.string().min(1).max(60).trim(),
    // multipart/form-data sends arrays as JSON strings
    tags: jsonStringArray(z.array(z.string())).optional().default([]),
    isTrending: coercedBool,
    isTopPick: coercedBool,
    published: coercedBool,
    metaTitle: z.string().max(100).optional().default(''),
    metaDesc: z.string().max(200).optional().default(''),
    products: jsonStringArray(z.array(z.string())).optional().default([]),
});

const updatePostSchema = createPostSchema.partial();

module.exports = { createPostSchema, updatePostSchema };
