const postRepo = require('../repositories/post.repository');
const productRepo = require('../repositories/product.repository');
const clickRepo = require('../repositories/click.repository');
const api = require('../utils/apiResponse.utils');

const getDashboard = async (_req, res, next) => {
    try {
        const [totalPosts, publishedPosts, trendingPosts, totalProducts, totalClicks, recentClicks] =
            await Promise.all([
                postRepo.count(),
                postRepo.count({ published: true }),
                postRepo.count({ isTrending: true }),
                productRepo.count(),
                clickRepo.totalClicks(),
                clickRepo.recentClicks(10),
            ]);

        api.success(res, {
            totalPosts,
            publishedPosts,
            trendingPosts,
            totalProducts,
            totalClicks,
            recentClicks,
        });
    } catch (err) {
        next(err);
    }
};

module.exports = { getDashboard };
