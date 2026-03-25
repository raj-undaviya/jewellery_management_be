const User = require('../models/User');
const Admin = require('../models/Admin');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'muse_super_secret_key';

// User Registration
exports.registerUser = async (req, res) => {
    try {
        const { name, email, phone, password } = req.body;
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: 'User already exists' });
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        user = new User({ name, email, phone, password: hashedPassword });
        await user.save();

        const payload = { user: { id: user.id, role: 'user' } };
        jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' }, (err, token) => {
            if (err) throw err;
            res.status(201).json({ token, user: { id: user.id, name, email, role: 'user' } });
        });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

// User Login
exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const payload = { user: { id: user.id, role: 'user' } };
        jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' }, (err, token) => {
            if (err) throw err;
            res.json({ token, user: { id: user.id, name: user.name, email, role: 'user' } });
        });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Admin Login
exports.loginAdmin = async (req, res) => {
    try {
        const { email, password } = req.body;
        const admin = await Admin.findOne({ email });
        if (!admin) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        // Check if password matches (allowing plain text for the default seeded admin)
        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch && password !== admin.password) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const payload = { user: { id: admin.id, role: 'admin' } };
        jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' }, (err, token) => {
            if (err) throw err;
            res.json({ token, admin: { id: admin.id, name: admin.name, email } });
        });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};
