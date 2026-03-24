const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const { Schema } = mongoose;

const userSchema = new Schema(
    {
        username: { type: String, required: true, unique: true, trim: true, minlength: 3 },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        password: { type: String, required: true, minlength: 6 },
        role: { type: String, enum: ['admin'], default: 'admin' },
    },
    { timestamps: true }
);

// Hash password before save (Mongoose v9: async hooks are Promise-based, no next param)
userSchema.pre('save', async function () {
    if (!this.isModified('password')) return;
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
});

// Compare password helper
userSchema.methods.comparePassword = async function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

// Never expose password in JSON output
userSchema.set('toJSON', {
    transform(_doc, ret) {
        delete ret.password;
        return ret;
    },
});

module.exports = mongoose.model('User', userSchema);
