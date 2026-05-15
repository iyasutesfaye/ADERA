import React from 'react';

const ShareModal = ({ data, onClose }) => {
    if (!data) return null;

    const copyToClipboard = () => {
        navigator.clipboard.writeText(data.shareUrl);
        alert('Link copied!');
    };

    return (
        <div style={styles.overlay} onClick={onClose}>
            <div style={styles.modal} onClick={e => e.stopPropagation()}>
                <h2>🔗 Share Link Created</h2>
                <input type="text" value={data.shareUrl} readOnly style={styles.input} />
                {data.qrCode && <img src={data.qrCode} alt="QR" style={styles.qr} />}
                <div style={styles.buttons}>
                    <button onClick={copyToClipboard} style={styles.copyBtn}>Copy Link</button>
                    <button onClick={onClose} style={styles.closeBtn}>Close</button>
                </div>
                <p style={styles.info}>Expires in 24 hours • Max 5 downloads</p>
            </div>
        </div>
    );
};

const styles = {
    overlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 },
    modal: { background: 'white', borderRadius: '12px', padding: '30px', maxWidth: '500px', width: '90%', textAlign: 'center' },
    input: { width: '100%', padding: '12px', margin: '15px 0', border: '1px solid #ddd', borderRadius: '8px' },
    qr: { maxWidth: '200px', margin: '10px 0' },
    buttons: { display: 'flex', gap: '10px', marginTop: '15px' },
    copyBtn: { flex: 1, padding: '10px', background: '#2E7D32', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' },
    closeBtn: { flex: 1, padding: '10px', background: '#666', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' },
    info: { marginTop: '15px', fontSize: '12px', color: '#666' }
};

export default ShareModal;