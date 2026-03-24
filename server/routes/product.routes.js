const express = require('express');
const router = express.Router();
const {
    getPublicProducts,
    getProductBySlug,
    getAllProducts,
    createProduct,
    updateProduct,
    deleteProduct,
} = require('../controllers/product.controller');
const { protect } = require('../middleware/auth.middleware');
const { validate } = require('../middleware/validate.middleware');
const { createProductSchema, updateProductSchema } = require('../validators/product.validator');
const upload = require('../middleware/upload.middleware');

// ── Public ────────────────────────────────────────────────────────────────────
router.get('/', getPublicProducts);
router.get('/:slug', getProductBySlug);

// ── Admin ─────────────────────────────────────────────────────────────────────
router.use(protect);

router.get('/admin/all', getAllProducts);
router.post('/admin', upload.single('image'), validate(createProductSchema), createProduct);
router.put('/admin/:id', upload.single('image'), validate(updateProductSchema), updateProduct);
router.delete('/admin/:id', deleteProduct);

module.exports = router;
