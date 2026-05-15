const QRCode = require('qrcode');
const { v4: uuidv4 } = require('uuid');
const { files } = require('./fileController');

let shareLinks = [];

const createShareLink = async (req, res) => {
    try {
        const fileId = parseInt(req.params.fileId);
        const { maxDownloads = 5, expiresInHours = 24 } = req.body;
        
        const file = files.find(f => f.id === fileId && f.user_id === req.userId);
        if (!file) {
            return res.status(404).json({ error: 'File not found.' });
        }
        
        const token = uuidv4();
        const expiresAt = new Date();
        expiresAt.setHours(expiresAt.getHours() + expiresInHours);
        
        const shareLink = {
            id: shareLinks.length + 1,
            token,
            file_id: fileId,
            created_by: req.userId,
            max_downloads: maxDownloads,
            current_downloads: 0,
            expires_at: expiresAt,
            created_at: new Date()
        };
        shareLinks.push(shareLink);
        
        const shareUrl = `http://localhost:5000/api/share/download/${token}`;
        const qrCode = await QRCode.toDataURL(shareUrl);
        
        res.json({
            success: true,
            shareUrl,
            qrCode,
            token,
            expiresAt,
            maxDownloads
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to create share link.' });
    }
};

const getShareInfo = (req, res) => {
    const { token } = req.params;
    const shareLink = shareLinks.find(s => s.token === token);
    
    if (!shareLink) {
        return res.status(404).json({ error: 'Share link not found.' });
    }
    
    if (new Date() > new Date(shareLink.expires_at)) {
        return res.status(410).json({ error: 'Share link has expired.' });
    }
    
    const file = files.find(f => f.id === shareLink.file_id);
    res.json({
        success: true,
        file: {
            name: file.original_name,
            size: file.size,
            downloads_remaining: shareLink.max_downloads - shareLink.current_downloads
        }
    });
};

const downloadSharedFile = (req, res) => {
    const { token } = req.params;
    const shareLink = shareLinks.find(s => s.token === token);
    
    if (!shareLink) {
        return res.status(404).json({ error: 'Share link not found.' });
    }
    
    if (new Date() > new Date(shareLink.expires_at)) {
        return res.status(410).json({ error: 'Share link has expired.' });
    }
    
    if (shareLink.current_downloads >= shareLink.max_downloads) {
        return res.status(410).json({ error: 'Download limit reached.' });
    }
    
    const file = files.find(f => f.id === shareLink.file_id);
    if (!file) {
        return res.status(404).json({ error: 'File not found.' });
    }
    
    shareLink.current_downloads++;
    
    const filePath = require('path').join(__dirname, '../uploads', file.stored_name);
    res.download(filePath, file.original_name);
};

module.exports = { createShareLink, getShareInfo, downloadSharedFile };