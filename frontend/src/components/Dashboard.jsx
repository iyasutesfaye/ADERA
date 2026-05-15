import React, { useState, useEffect } from 'react';
import FileUpload from './FileUpload';
import FileList from './FileList';
import { api } from '../utils/api';

const Dashboard = ({ user, onLogout }) => {
    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchFiles();
    }, []);

    const fetchFiles = async () => {
        try {
            const response = await api.get('/files');
            setFiles(response.data.files || []);
        } catch (error) {
            console.error('Fetch error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleFileUploaded = (newFile) => {
        setFiles([newFile, ...files]);
    };

    const handleFileDeleted = (fileId) => {
        setFiles(files.filter(f => f.id !== fileId));
    };

    return (
        <div style={styles.container}>
            <nav style={styles.navbar}>
                <h1 style={styles.logo}>🔒 ADERA</h1>
                <div>
                    <span style={styles.userName}>👋 {user.username}</span>
                    <button onClick={onLogout} style={styles.logoutBtn}>Logout</button>
                </div>
            </nav>
            <main style={styles.main}>
                <FileUpload onFileUploaded={handleFileUploaded} />
                {loading ? <div style={styles.loading}>Loading...</div> : <FileList files={files} onFileDeleted={handleFileDeleted} />}
            </main>
        </div>
    );
};

const styles = {
    container: { minHeight: '100vh', background: '#f5f5f5' },
    navbar: { background: '#1E3A5F', color: 'white', padding: '15px 30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
    logo: { fontSize: '24px', margin: 0 },
    userName: { marginRight: '15px' },
    logoutBtn: { background: '#C62828', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer' },
    main: { maxWidth: '1200px', margin: '0 auto', padding: '30px' },
    loading: { textAlign: 'center', padding: '40px', color: '#666' }
};

export default Dashboard;