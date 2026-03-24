const express = require('express');
const router = express.Router();
const {
    getPublicPosts,
    getPostBySlug,
    getAllPosts,
    createPost,
    updatePost,
    deletePost,
} = require('../controllers/post.controller');
const { protect } = require('../middleware/auth.middleware');
const { validate } = require('../middleware/validate.middleware');
const { createPostSchema, updatePostSchema } = require('../validators/post.validator');
const upload = require('../middleware/upload.middleware');

// ── Public Routes ─────────────────────────────────────────────────────────────
router.get('/', getPublicPosts);
router.get('/:slug', getPostBySlug);

// ── Admin Routes ──────────────────────────────────────────────────────────────
router.use(protect); // All routes below require auth

router.get('/admin/all', getAllPosts);
router.post(
    '/admin',
    upload.single('coverImage'),
    validate(createPostSchema),
    createPost
);
router.put(
    '/admin/:id',
    upload.single('coverImage'),
    validate(updatePostSchema),
    updatePost
);
router.delete('/admin/:id', deletePost);

module.exports = router;
