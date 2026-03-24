const mongoose = require('mongoose');

const { Schema } = mongoose;

const clickSchema = new Schema(
    {
        product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
        store: { type: String, default: '' }, // which store was clicked e.g. "Amazon"
        shortCode: { type: String, default: '' }, // which link was clicked
        ip: { type: String, default: '' },
        userAgent: { type: String, default: '' },
        referer: { type: String, default: '' },
    },
    { timestamps: true }
);

clickSchema.index({ product: 1, createdAt: -1 });
clickSchema.index({ store: 1 });

module.exports = mongoose.model('Click', clickSchema);
