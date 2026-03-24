const slugify = require('slugify');
const crypto = require('crypto');
const productRepo = require('../repositories/product.repository');
const { uploadImage, deleteImage } = require('./cloudinary.service');
const { AppError } = require('../middleware/error.middleware');

const generateShortCode = () => crypto.randomBytes(4).toString('hex'); // 8-char hex

const generateSlug = (name) =>
    slugify(name, { lower: true, strict: true, trim: true });

/**
 * Assign a unique shortCode to every affiliate link that doesn't have one yet.
 */
const assignShortCodes = async (affiliateLinks = []) => {
    const result = [];
    for (const link of affiliateLinks) {
        if (link.shortCode) {
            result.push(link);
        } else {
            let shortCode = generateShortCode();
            while (await productRepo.findByAffiliateShortCode(shortCode)) {
                shortCode = generateShortCode();
            }
            result.push({ ...link, shortCode });
        }
    }
    return result;
};

const getAll = (filter = {}) => productRepo.findAll(filter);

const getBySlug = async (slug) => {
    const product = await productRepo.findBySlug(slug);
    if (!product) throw new AppError('Product not found.', 404);
    return product;
};

const getById = async (id) => {
    const product = await productRepo.findById(id);
    if (!product) throw new AppError('Product not found.', 404);
    return product;
};

const create = async (data, file) => {
    const slug = generateSlug(data.name);
    const existing = await productRepo.findBySlug(slug);
    if (existing) throw new AppError('A product with this name already exists.', 409);

    // Generate unique shortCode for each affiliate link
    const affiliateLinks = await assignShortCodes(data.affiliateLinks || []);

    let image = { url: '', publicId: '' };
    if (file) {
        image = await uploadImage(file.buffer, 'affiliateblog/products');
    }

    return productRepo.create({ ...data, slug, affiliateLinks, image });
};

const update = async (id, data, file) => {
    const existing = await productRepo.findById(id);
    if (!existing) throw new AppError('Product not found.', 404);

    let image = existing.image;
    if (file) {
        if (existing.image?.publicId) await deleteImage(existing.image.publicId);
        image = await uploadImage(file.buffer, 'affiliateblog/products');
    }

    let slug = existing.slug;
    if (data.name && data.name !== existing.name) {
        slug = generateSlug(data.name);
    }

    // Preserve existing shortCodes, assign new ones for any new links
    const affiliateLinks = data.affiliateLinks
        ? await assignShortCodes(data.affiliateLinks)
        : existing.affiliateLinks;

    return productRepo.updateById(id, { ...data, slug, image, affiliateLinks });
};

const remove = async (id) => {
    const product = await productRepo.findById(id);
    if (!product) throw new AppError('Product not found.', 404);
    if (product.image?.publicId) await deleteImage(product.image.publicId);
    return productRepo.deleteById(id);
};

module.exports = { getAll, getBySlug, getById, create, update, remove };
