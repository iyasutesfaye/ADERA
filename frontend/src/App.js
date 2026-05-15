import React, { useState, useEffect } from 'react';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import { api, setAuthToken } from './utils/api';

function App() {
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (token) {
            setAuthToken(token);
            fetchUser();
        } else {
            setLoading(false);
        }
    }, [token]);

    const fetchUser = async () => {
        try {
            const response = await api.get('/auth/me');
            setUser(response.data);
        } catch (error) {
            localStorage.removeItem('token');
            setToken(null);
            setAuthToken(null);
        } finally {
            setLoading(false);
        }
    };

    const handleLogin = (newToken, userData) => {
        localStorage.setItem('token', newToken);
        setAuthToken(newToken);
        setToken(newToken);
        setUser(userData);
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        setAuthToken(null);
        setToken(null);
        setUser(null);
    };

    if (loading) {
        return <div style={styles.loading}>Loading ADERA...</div>;
    }

    if (!token || !user) {
        return (
            <div style={styles.container}>
                <div style={styles.header}>
                    <h1 style={styles.logo}>🔒 ADERA</h1>
                    <p style={styles.tagline}>Secure File Sharing • አደራ በእምነት</p>
                </div>
                <div style={styles.authContainer}>
                    <Login onLogin={handleLogin} />
                    <Register onRegister={handleLogin} />
                </div>
            </div>
        );
    }

    return <Dashboard user={user} onLogout={handleLogout} />;
}

const styles = {
    container: {
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '40px 20px'
    },
    header: { textAlign: 'center', marginBottom: '40px' },
    logo: { fontSize: '48px', color: 'white', marginBottom: '10px' },
    tagline: { fontSize: '18px', color: 'rgba(255,255,255,0.9)' },
    authContainer: { display: 'flex', justifyContent: 'center', gap: '40px', flexWrap: 'wrap', maxWidth: '900px', margin: '0 auto' },
    loading: { minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }
};

export default App;