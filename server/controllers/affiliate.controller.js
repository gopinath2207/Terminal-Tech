const productRepo = require('../repositories/product.repository');
const clickRepo = require('../repositories/click.repository');

/**
 * GET /go/:shortCode
 * Finds the product + matched affiliate link by shortCode,
 * logs the click (store, shortCode), then 301-redirects.
 */
const redirect = async (req, res, next) => {
    try {
        const { shortCode } = req.params;
        const product = await productRepo.findByAffiliateShortCode(shortCode);
        if (!product) return res.status(404).json({ success: false, message: 'Affiliate link not found.' });

        // Find the specific link that matched this shortCode
        const link = product.affiliateLinks.find((l) => l.shortCode === shortCode);
        if (!link) return res.status(404).json({ success: false, message: 'Affiliate link not found.' });

        // Fire-and-forget click tracking — does NOT block redirect
        Promise.all([
            clickRepo.create({
                product: product._id,
                store: link.store,
                shortCode,
                ip: req.ip,
                userAgent: req.headers['user-agent'] || '',
                referer: req.headers['referer'] || '',
            }),
            productRepo.incrementClicks(product._id),
        ]).catch((err) => console.error('[Affiliate click tracking error]', err.message));

        return res.redirect(301, link.url);
    } catch (err) {
        next(err);
    }
};

module.exports = { redirect };
