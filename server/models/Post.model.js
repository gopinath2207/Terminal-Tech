const mongoose = require('mongoose');

const { Schema } = mongoose;

const postSchema = new Schema(
    {
        title: { type: String, required: true, trim: true },
        slug: { type: String, required: true, unique: true, lowercase: true },
        excerpt: { type: String, required: true, maxlength: 400 },
        content: { type: String, required: true }, // HTML/Markdown body
        category: { type: String, required: true, trim: true },
        tags: [{ type: String, trim: true }],
        coverImage: {
            url: { type: String, default: '' },
            publicId: { type: String, default: '' },
        },
        products: [{ type: Schema.Types.ObjectId, ref: 'Product' }],
        isTrending: { type: Boolean, default: false },
        isTopPick: { type: Boolean, default: false },
        views: { type: Number, default: 0 },
        author: { type: Schema.Types.ObjectId, ref: 'User' },
        metaTitle: { type: String, default: '' },
        metaDesc: { type: String, default: '' },
        published: { type: Boolean, default: false },
    },
    { timestamps: true }
);

// Compound + field indexes for efficient queries
postSchema.index({ slug: 1 });
postSchema.index({ category: 1 });
postSchema.index({ isTrending: 1, createdAt: -1 });
postSchema.index({ isTopPick: 1, createdAt: -1 });
postSchema.index({ published: 1, createdAt: -1 });

module.exports = mongoose.model('Post', postSchema);
