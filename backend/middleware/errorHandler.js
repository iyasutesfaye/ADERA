const errorHandler = (err, req, res, next) => {
    console.error('❌ Error:', err.message);
    
    if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ error: 'File too large. Maximum size is 50MB.' });
    }
    
    if (err.name === 'JsonWebTokenError') {
        return res.status(401).json({ error: 'Invalid authentication token.' });
    }
    
    if (err.name === 'TokenExpiredError') {
        return res.status(401).json({ error: 'Authentication token expired.' });
    }
    
    res.status(500).json({ error: 'Internal server error.' });
};

module.exports = { errorHandler };