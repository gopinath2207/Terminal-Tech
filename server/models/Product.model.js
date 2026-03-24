const mongoose = require('mongoose');

const { Schema } = mongoose;

const affiliateLinkSchema = new Schema(
    {
        store: { type: String, required: true, trim: true }, // e.g. "Amazon", "Flipkart", "Meesho"
        url: { type: String, required: true },               // full affiliate URL
        shortCode: { type: String, required: true, unique: true }, // /go/:shortCode redirect
    },
    { _id: false }
);

const productSchema = new Schema(
    {
        name: { type: String, required: true, trim: true },
        slug: { type: String, required: true, unique: true, lowercase: true },
        description: { type: String, default: '' },
        image: {
            url: { type: String, default: '' },
            publicId: { type: String, default: '' },
        },
        // Replaces single `affiliateUrl` — supports unlimited stores
        affiliateLinks: { type: [affiliateLinkSchema], default: [] },
        price: { type: String, default: '' },
        rating: { type: Number, min: 0, max: 5, default: 0 },
        isBestValue: { type: Boolean, default: false },
        specs: [
            {
                key: { type: String, trim: true },
                value: { type: String, trim: true },
            },
        ],
        category: { type: String, trim: true, default: '' },
        clicks: { type: Number, default: 0 }, // aggregated total across all stores
    },
    { timestamps: true }
);

productSchema.index({ slug: 1 });
productSchema.index({ category: 1 });
productSchema.index({ 'affiliateLinks.shortCode': 1 }); // for fast /go/:shortCode lookup

module.exports = mongoose.model('Product', productSchema);
