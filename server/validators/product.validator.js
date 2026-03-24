const { z } = require('zod');

// Helper: parse JSON strings sent via multipart/form-data
const jsonPreprocess = (schema) =>
    z.preprocess((v) => {
        if (typeof v === 'string') {
            try { return JSON.parse(v); } catch { return v; }
        }
        return v;
    }, schema);

const affiliateLinkSchema = z.object({
    store: z.string().min(1, 'Store name is required').trim(),
    url: z.string().url('Must be a valid URL'),
});

const createProductSchema = z.object({
    name: z.string().min(2).max(200).trim(),
    description: z.string().optional().default(''),
    // At least one affiliate link required — sent as JSON string from multipart form
    affiliateLinks: jsonPreprocess(
        z.array(affiliateLinkSchema).min(1, 'At least one affiliate link is required')
    ),
    price: z.string().optional().default(''),
    rating: z.coerce.number().min(0).max(5).optional().default(0),
    isBestValue: z
        .preprocess((v) => v === 'true' || v === true, z.boolean())
        .optional()
        .default(false),
    specs: jsonPreprocess(
        z.array(z.object({ key: z.string(), value: z.string() }))
    ).optional().default([]),
    category: z.string().optional().default(''),
});

const updateProductSchema = createProductSchema.partial();

module.exports = { createProductSchema, updateProductSchema };
