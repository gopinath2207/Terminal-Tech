const slugify = require('slugify');
const postRepo = require('../repositories/post.repository');
const { uploadImage, deleteImage } = require('./cloudinary.service');
const { AppError } = require('../middleware/error.middleware');

const generateSlug = (title) =>
    slugify(title, { lower: true, strict: true, trim: true });

const getAllPublic = (filter = {}) =>
    postRepo.findAllPopulated({ ...filter, published: true });

const getAll = (filter = {}) => postRepo.findAllPopulated(filter);

const getBySlug = async (slug) => {
    const post = await postRepo.findBySlug(slug);
    if (!post) throw new AppError('Post not found.', 404);
    // Increment views asynchronously (non-blocking)
    postRepo.incrementViews(post._id).catch(console.error);
    return post;
};

const getById = async (id) => {
    const post = await postRepo.findById(id);
    if (!post) throw new AppError('Post not found.', 404);
    return post;
};

const create = async (data, file, userId) => {
    const slug = generateSlug(data.title);
    const existing = await postRepo.findBySlug(slug);
    if (existing) throw new AppError('A post with this title already exists. Change the title.', 409);

    let coverImage = { url: '', publicId: '' };
    if (file) {
        coverImage = await uploadImage(file.buffer);
    }

    const post = await postRepo.create({
        ...data,
        slug,
        coverImage,
        author: userId,
    });
    return post;
};

const update = async (id, data, file) => {
    const existing = await postRepo.findById(id);
    if (!existing) throw new AppError('Post not found.', 404);

    let coverImage = existing.coverImage;
    if (file) {
        // Delete old image from Cloudinary before uploading new one
        if (existing.coverImage?.publicId) {
            await deleteImage(existing.coverImage.publicId);
        }
        coverImage = await uploadImage(file.buffer);
    }

    // Re-slug only if title changed
    let slug = existing.slug;
    if (data.title && data.title !== existing.title) {
        slug = generateSlug(data.title);
    }

    return postRepo.updateById(id, { ...data, slug, coverImage });
};

const remove = async (id) => {
    const post = await postRepo.findById(id);
    if (!post) throw new AppError('Post not found.', 404);
    if (post.coverImage?.publicId) await deleteImage(post.coverImage.publicId);
    return postRepo.deleteById(id);
};

const getStats = () => ({
    total: postRepo.count(),
    published: postRepo.count({ published: true }),
    trending: postRepo.count({ isTrending: true }),
});

module.exports = { getAllPublic, getAll, getBySlug, getById, create, update, remove, getStats };
