const Click = require('../models/Click.model');

const create = (data) => Click.create(data);

const countByProduct = (productId) => Click.countDocuments({ product: productId });

const totalClicks = () => Click.countDocuments();

const recentClicks = (limit = 10) =>
    Click.find().sort({ createdAt: -1 }).limit(limit).populate('product', 'name slug').lean();

module.exports = { create, countByProduct, totalClicks, recentClicks };
