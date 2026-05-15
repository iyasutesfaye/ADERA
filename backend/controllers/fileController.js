const fs = require('fs');
const path = require('path');
const { users } = require('./authController');

let files = [];

const uploadFile = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded.' });
        }
        
        const newFile = {
            id: files.length + 1,
            user_id: req.userId,
            original_name: req.file.originalname,
            stored_name: req.file.filename,
            size: req.file.size,
            mimetype: req.file.mimetype,
            created_at: new Date(),
            download_count: 0
        };
        files.push(newFile);
        
        const user = users.find(u => u.id === req.userId);
        if (user) user.total_uploads = (user.total_uploads || 0) + 1;
        
        res.status(201).json({
            success: true,
            message: 'File uploaded successfully.',
            file: newFile
        });
    } catch (error) {
        res.status(500).json({ error: 'Upload failed.' });
    }
};

const getFiles = (req, res) => {
    const userFiles = files.filter(f => f.user_id === req.userId);
    res.json({ files: userFiles });
};

const deleteFile = (req, res) => {
    const fileId = parseInt(req.params.id);
    const index = files.findIndex(f => f.id === fileId && f.user_id === req.userId);
    
    if (index === -1) {
        return res.status(404).json({ error: 'File not found.' });
    }
    
    const file = files[index];
    const filePath = path.join(__dirname, '../uploads', file.stored_name);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    
    files.splice(index, 1);
    res.json({ success: true, message: 'File deleted.' });
};

const downloadFile = (req, res) => {
    const fileId = parseInt(req.params.id);
    const file = files.find(f => f.id === fileId && f.user_id === req.userId);
    
    if (!file) {
        return res.status(404).json({ error: 'File not found.' });
    }
    
    const filePath = path.join(__dirname, '../uploads', file.stored_name);
    if (!fs.existsSync(filePath)) {
        return res.status(404).json({ error: 'File not found on server.' });
    }
    
    file.download_count++;
    res.download(filePath, file.original_name);
};

module.exports = { uploadFile, getFiles, deleteFile, downloadFile, files };