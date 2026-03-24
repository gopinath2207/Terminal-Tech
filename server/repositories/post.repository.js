const Post = require('../models/Post.model');

/**
 * All DB queries for Posts. Uses .lean() for public/read-heavy routes.
 */

const findAll = (filter = {}, projection = {}) =>
    Post.find(filter, projection).lean();

const findAllPopulated = (filter = {}) =>
    Post.find(filter).populate('products', 'name slug image price rating isBestValue specs shortCode').lean();

const findBySlug = (slug) =>
    Post.findOne({ slug }).populate('products', 'name slug image price rating isBestValue specs shortCode affiliateUrl').lean();

const findById = (id) => Post.findById(id).lean();

const count = (filter = {}) => Post.countDocuments(filter);

const create = (data) => Post.create(data);

const updateById = (id, data) =>
    Post.findByIdAndUpdate(id, data, { new: true, runValidators: true });

const deleteById = (id) => Post.findByIdAndDelete(id);

const incrementViews = (id) =>
    Post.findByIdAndUpdate(id, { $inc: { views: 1 } });

module.exports = {
    findAll,
    findAllPopulated,
    findBySlug,
    findById,
    count,
    create,
    updateById,
    deleteById,
    incrementViews,
};
