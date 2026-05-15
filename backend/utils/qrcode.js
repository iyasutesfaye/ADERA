const QRCode = require('qrcode');

const generateQRCode = async (text) => {
    try {
        return await QRCode.toDataURL(text, {
            errorCorrectionLevel: 'H',
            margin: 1,
            width: 250,
            color: { dark: '#1E3A5F', light: '#FFFFFF' }
        });
    } catch (error) {
        console.error('QR Code error:', error);
        return null;
    }
};

module.exports = { generateQRCode };