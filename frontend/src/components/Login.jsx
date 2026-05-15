import React, { useState } from 'react';
import { api } from '../utils/api';

const Login = ({ onLogin }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await api.post('/auth/login', { email, password });
            if (response.data.success) {
                onLogin(response.data.token, response.data.user);
            } else {
                setError(response.data.error || 'Login failed');
            }
        } catch (err) {
            setError(err.response?.data?.error || 'Connection error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.card}>
            <h2 style={styles.title}>Login</h2>
            {error && <div style={styles.error}>{error}</div>}
            <form onSubmit={handleSubmit}>
                <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required style={styles.input} />
                <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required style={styles.input} />
                <button type="submit" disabled={loading} style={styles.button}>{loading ? 'Logging in...' : 'Login'}</button>
            </form>
        </div>
    );
};

const styles = {
    card: { background: 'white', borderRadius: '12px', padding: '30px', width: '100%', maxWidth: '350px', boxShadow: '0 10px 40px rgba(0,0,0,0.1)' },
    title: { color: '#1E3A5F', marginBottom: '20px', textAlign: 'center' },
    input: { width: '100%', padding: '12px', marginBottom: '15px', border: '1px solid #ddd', borderRadius: '8px', boxSizing: 'border-box' },
    button: { width: '100%', padding: '12px', background: '#1E3A5F', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' },
    error: { background: '#fee', color: '#c00', padding: '10px', borderRadius: '8px', marginBottom: '15px', textAlign: 'center' }
};

export default Login;