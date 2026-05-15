import React, { useState } from 'react';
import { api } from '../utils/api';

const Register = ({ onRegister }) => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        if (password.length < 6) {
            setError('Password must be at least 6 characters');
            setLoading(false);
            return;
        }

        try {
            const response = await api.post('/auth/register', { username, email, password });
            if (response.data.success) {
                onRegister(response.data.token, response.data.user);
            } else {
                setError(response.data.error || 'Registration failed');
            }
        } catch (err) {
            setError(err.response?.data?.error || 'Connection error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.card}>
            <h2 style={styles.title}>Register</h2>
            {error && <div style={styles.error}>{error}</div>}
            <form onSubmit={handleSubmit}>
                <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} required style={styles.input} />
                <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required style={styles.input} />
                <input type="password" placeholder="Password (min 6 chars)" value={password} onChange={(e) => setPassword(e.target.value)} required style={styles.input} />
                <button type="submit" disabled={loading} style={styles.button}>{loading ? 'Creating account...' : 'Register'}</button>
            </form>
        </div>
    );
};

const styles = {
    card: { background: 'white', borderRadius: '12px', padding: '30px', width: '100%', maxWidth: '350px', boxShadow: '0 10px 40px rgba(0,0,0,0.1)' },
    title: { color: '#1E3A5F', marginBottom: '20px', textAlign: 'center' },
    input: { width: '100%', padding: '12px', marginBottom: '15px', border: '1px solid #ddd', borderRadius: '8px', boxSizing: 'border-box' },
    button: { width: '100%', padding: '12px', background: '#2E7D32', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' },
    error: { background: '#fee', color: '#c00', padding: '10px', borderRadius: '8px', marginBottom: '15px', textAlign: 'center' }
};

export default Register;