const { AppError } = require('./error.middleware');

/**
 * Factory middleware: validates req.body against a Zod schema.
 * Attaches parsed/coerced data back to req.body on success.
 */
const validate = (schema) => (req, _res, next) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
        const messages = (result.error.issues || result.error.errors || []).map((e) => `${e.path.join('.')}: ${e.message}`).join('; ');
        return next(new AppError(`Validation error: ${messages}`, 400));
    }
    req.body = result.data;
    next();
};

module.exports = { validate };
