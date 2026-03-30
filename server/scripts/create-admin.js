/**
 * create-admin.js
 * Run once to seed the admin account directly into MongoDB.
 * Usage: node scripts/create-admin.js
 */

require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// ── Hardcoded admin details — change these before running ──────────────────
const ADMIN = {
    username: 'terminal&tech',
    email:    'gopinathu6@gmail.com',
    password: 'Umag@2207',
    role:     'admin',
};
// ─────────────────────────────────────────────────────────────────────────────

async function main() {
    const uri = process.env.MONGO_URI;
    if (!uri) {
        console.error('❌  MONGO_URI is not set in .env');
        process.exit(1);
    }

    console.log('🔌  Connecting to MongoDB…');
    await mongoose.connect(uri, { dbName: process.env.MONGO_DB_NAME || 'affiliateblog' });
    console.log('✅  Connected.');

    const UserSchema = new mongoose.Schema(
        {
            username: { type: String, required: true, unique: true, trim: true },
            email:    { type: String, required: true, unique: true, lowercase: true },
            password: { type: String, required: true },
            role:     { type: String, enum: ['admin'], default: 'admin' },
        },
        { timestamps: true }
    );

    // Use existing model if already registered (avoids OverwriteModelError)
    const User = mongoose.models.User || mongoose.model('User', UserSchema);

    const existing = await User.findOne({ email: ADMIN.email });
    if (existing) {
        console.log('⚠️   Admin already exists:', existing.email);
        await mongoose.disconnect();
        return;
    }

    const salt     = await bcrypt.genSalt(12);
    const hashed   = await bcrypt.hash(ADMIN.password, salt);

    const user = await User.create({
        username: ADMIN.username,
        email:    ADMIN.email,
        password: hashed,
        role:     ADMIN.role,
    });

    console.log('🎉  Admin created successfully!');
    console.log('    ID      :', user._id.toString());
    console.log('    Username:', user.username);
    console.log('    Email   :', user.email);
    console.log('    Role    :', user.role);

    await mongoose.disconnect();
}

main().catch((err) => {
    console.error('❌  Error:', err.message);
    process.exit(1);
});
