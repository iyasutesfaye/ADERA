const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { validateEmail, validatePassword, validateUsername } = require('../utils/validation');

let users = [];

const register = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        
        if (!username || !email || !password) {
            return res.status(400).json({ error: 'All fields are required.' });
        }
        
        if (!validateUsername(username)) {
            return res.status(400).json({ error: 'Username must be 3-20 characters.' });
        }
        
        if (!validateEmail(email)) {
            return res.status(400).json({ error: 'Invalid email format.' });
        }
        
        if (!validatePassword(password)) {
            return res.status(400).json({ error: 'Password must be at least 6 characters.' });
        }
        
        if (users.find(u => u.email === email)) {
            return res.status(409).json({ error: 'User already exists.' });
        }
        
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = {
            id: users.length + 1,
            username,
            email,
            password_hash: hashedPassword,
            created_at: new Date()
        };
        users.push(newUser);
        
        const token = jwt.sign(
            { userId: newUser.id, username: newUser.username, email: newUser.email },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRE || '7d' }
        );
        
        res.status(201).json({
            success: true,
            message: 'User registered successfully.',
            token,
            user: { id: newUser.id, username: newUser.username, email: newUser.email }
        });
    } catch (error) {
        res.status(500).json({ error: 'Registration failed.' });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        const user = users.find(u => u.email === email);
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials.' });
        }
        
        const isValid = await bcrypt.compare(password, user.password_hash);
        if (!isValid) {
            return res.status(401).json({ error: 'Invalid credentials.' });
        }
        
        const token = jwt.sign(
            { userId: user.id, username: user.username, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRE || '7d' }
        );
        
        res.json({
            success: true,
            message: 'Login successful.',
            token,
            user: { id: user.id, username: user.username, email: user.email }
        });
    } catch (error) {
        res.status(500).json({ error: 'Login failed.' });
    }
};

const getMe = (req, res) => {
    const user = users.find(u => u.id === req.userId);
    if (!user) {
        return res.status(404).json({ error: 'User not found.' });
    }
    res.json({ id: user.id, username: user.username, email: user.email });
};

module.exports = { register, login, getMe, users };