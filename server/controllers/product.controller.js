const productService = require('../services/product.service');
const api = require('../utils/apiResponse.utils');

// ── Public ────────────────────────────────────────────────────────────────────

const getPublicProducts = async (req, res, next) => {
    try {
        const filter = {};
        if (req.query.category) filter.category = req.query.category;
        const products = await productService.getAll(filter);
        api.success(res, { products, count: products.length });
    } catch (err) {
        next(err);
    }
};

const getProductBySlug = async (req, res, next) => {
    try {
        const product = await productService.getBySlug(req.params.slug);
        api.success(res, { product });
    } catch (err) {
        next(err);
    }
};

// ── Admin ─────────────────────────────────────────────────────────────────────

const getAllProducts = async (req, res, next) => {
    try {
        const products = await productService.getAll();
        api.success(res, { products, count: products.length });
    } catch (err) {
        next(err);
    }
};

const createProduct = async (req, res, next) => {
    try {
        const product = await productService.create(req.body, req.file);
        api.created(res, { product }, 'Product created successfully.');
    } catch (err) {
        next(err);
    }
};

const updateProduct = async (req, res, next) => {
    try {
        const product = await productService.update(req.params.id, req.body, req.file);
        api.success(res, { product }, 'Product updated successfully.');
    } catch (err) {
        next(err);
    }
};

const deleteProduct = async (req, res, next) => {
    try {
        await productService.remove(req.params.id);
        api.success(res, null, 'Product deleted successfully.');
    } catch (err) {
        next(err);
    }
};

module.exports = {
    getPublicProducts,
    getProductBySlug,
    getAllProducts,
    createProduct,
    updateProduct,
    deleteProduct,
};
