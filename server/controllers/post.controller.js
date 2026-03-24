const postService = require('../services/post.service');
const api = require('../utils/apiResponse.utils');

// ── Public ────────────────────────────────────────────────────────────────────

const getPublicPosts = async (req, res, next) => {
    try {
        const filter = {};
        if (req.query.trending === 'true') filter.isTrending = true;
        if (req.query.topPick === 'true') filter.isTopPick = true;
        if (req.query.category) filter.category = req.query.category;
        const posts = await postService.getAllPublic(filter);
        api.success(res, { posts, count: posts.length });
    } catch (err) {
        next(err);
    }
};

const getPostBySlug = async (req, res, next) => {
    try {
        const post = await postService.getBySlug(req.params.slug);
        api.success(res, { post });
    } catch (err) {
        next(err);
    }
};

// ── Admin ─────────────────────────────────────────────────────────────────────

const getAllPosts = async (req, res, next) => {
    try {
        const posts = await postService.getAll();
        api.success(res, { posts, count: posts.length });
    } catch (err) {
        next(err);
    }
};

const createPost = async (req, res, next) => {
    try {
        const post = await postService.create(req.body, req.file, req.user._id);
        api.created(res, { post }, 'Post created successfully.');
    } catch (err) {
        next(err);
    }
};

const updatePost = async (req, res, next) => {
    try {
        const post = await postService.update(req.params.id, req.body, req.file);
        api.success(res, { post }, 'Post updated successfully.');
    } catch (err) {
        next(err);
    }
};

const deletePost = async (req, res, next) => {
    try {
        await postService.remove(req.params.id);
        api.success(res, null, 'Post deleted successfully.');
    } catch (err) {
        next(err);
    }
};

module.exports = { getPublicPosts, getPostBySlug, getAllPosts, createPost, updatePost, deletePost };
