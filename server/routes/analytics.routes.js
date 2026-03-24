const express = require('express');
const router = express.Router();
const { getDashboard } = require('../controllers/analytics.controller');
const { protect } = require('../middleware/auth.middleware');

// GET /api/analytics  (admin only)
router.get('/', protect, getDashboard);

module.exports = router;
