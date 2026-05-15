const express = require('express');
const router = express.Router();
const { uploadFile, getFiles, deleteFile, downloadFile } = require('../controllers/fileController');
const authenticateToken = require('../middleware/auth');
const upload = require('../middleware/upload');

router.post('/upload', authenticateToken, upload.single('file'), uploadFile);
router.get('/', authenticateToken, getFiles);
router.delete('/:id', authenticateToken, deleteFile);
router.get('/download/:id', authenticateToken, downloadFile);

module.exports = router;