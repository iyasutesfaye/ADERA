const express = require('express');
const router = express.Router();
const { createShareLink, getShareInfo, downloadSharedFile } = require('../controllers/shareController');
const authenticateToken = require('../middleware/auth');

router.post('/:fileId', authenticateToken, createShareLink);
router.get('/info/:token', getShareInfo);
router.get('/download/:token', downloadSharedFile);

module.exports = router;