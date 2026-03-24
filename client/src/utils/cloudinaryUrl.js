/**
 * Build an optimised Cloudinary URL using auto-format and auto-quality.
 * Falls back gracefully if url is empty/null.
 *
 * @param {string} url - Raw Cloudinary URL
 * @param {object} opts - Optional override: { width, quality, format }
 */
export const buildCloudinaryUrl = (url, opts = {}) => {
    if (!url) return '';
    const { width = 800, quality = 'auto', format = 'auto' } = opts;

    // Insert transformations after /upload/
    const transform = `f_${format},q_${quality},w_${width}`;
    return url.replace('/upload/', `/upload/${transform}/`);
};
