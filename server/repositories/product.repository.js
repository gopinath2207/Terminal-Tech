const Product = require('../models/Product.model');

const findAll = (filter = {}) => Product.find(filter).lean();

const findBySlug = (slug) => Product.findOne({ slug }).lean();

// Search inside the affiliateLinks sub-array for a matching shortCode
const findByAffiliateShortCode = (shortCode) =>
    Product.findOne({ 'affiliateLinks.shortCode': shortCode }).lean();

const findById = (id) => Product.findById(id).lean();

const count = (filter = {}) => Product.countDocuments(filter);

const create = (data) => Product.create(data);

const updateById = (id, data) =>
    Product.findByIdAndUpdate(id, data, { new: true, runValidators: true });

const deleteById = (id) => Product.findByIdAndDelete(id);

const incrementClicks = (id) =>
    Product.findByIdAndUpdate(id, { $inc: { clicks: 1 } });

module.exports = {
    findAll,
    findBySlug,
    findByAffiliateShortCode,
    findById,
    count,
    create,
    updateById,
    deleteById,
    incrementClicks,
};
