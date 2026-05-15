import React, { useState } from 'react';
import ShareModal from './ShareModal';
import { api } from '../utils/api';
import bytes from 'bytes';

const FileList = ({ files, onFileDeleted }) => {
    const [shareData, setShareData] = useState(null);

    const formatDate = (date) => new Date(date).toLocaleDateString();

    const handleDelete = async (fileId) => {
        if (!window.confirm('Delete this file?')) return;
        await api.delete(`/files/${fileId}`);
        onFileDeleted(fileId);
    };

    const handleShare = async (fileId) => {
        const response = await api.post(`/share/${fileId}`, { maxDownloads: 5, expiresInHours: 24 });
        if (response.data.success) setShareData(response.data);
    };

    if (files.length === 0) {
        return <div style={styles.empty}>📭 No files yet. Upload your first file!</div>;
    }

    return (
        <>
            <div style={styles.container}>
                <h2 style={styles.title}>📁 My Files</h2>
                {files.map(file => (
                    <div key={file.id} style={styles.card}>
                        <div style={styles.fileInfo}>
                            <strong>{file.original_name}</strong>
                            <small>{bytes(file.size)} • {formatDate(file.created_at)}</small>
                        </div>
                        <div>
                            <button onClick={() => handleShare(file.id)} style={styles.shareBtn}>Share</button>
                            <button onClick={() => handleDelete(file.id)} style={styles.deleteBtn}>Delete</button>
                        </div>
                    </div>
                ))}
            </div>
            <ShareModal data={shareData} onClose={() => setShareData(null)} />
        </>
    );
};

const styles = {
    container: { background: 'white', borderRadius: '12px', padding: '20px' },
    title: { color: '#1E3A5F', marginBottom: '20px' },
    card: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px', borderBottom: '1px solid #eee' },
    fileInfo: { display: 'flex', flexDirection: 'column', gap: '5px' },
    shareBtn: { background: '#1E3A5F', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '6px', marginRight: '8px', cursor: 'pointer' },
    deleteBtn: { background: '#C62828', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer' },
    empty: { textAlign: 'center', padding: '60px', background: 'white', borderRadius: '12px', color: '#666' }
};

export default FileList;