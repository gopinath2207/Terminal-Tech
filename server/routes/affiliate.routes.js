const express = require('express');
const router = express.Router();
const { redirect } = require('../controllers/affiliate.controller');

// GET /go/:shortCode  →  301 redirect to affiliateUrl
router.get('/:shortCode', redirect);

module.exports = router;
