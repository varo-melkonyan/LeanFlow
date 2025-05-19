const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const sendActivationEmail = require('../utils/sendActivationEmail');

console.log('auth.js loaded');

// ✅ GET fallback
router.get('/login', (req, res) => {
  console.log('GET /login endpoint is active.');
  res.json({ message: 'Login endpoint is active. Use POST method.' });
});

// ✅ POST login
router.post('/login', async (req, res) => {
  console.log('POST /login endpoint is active.');
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });
    if (!user.isActive) return res.status(403).json({ error: 'Account not activated.' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ error: 'Invalid credentials' });

    res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      chatColor: user.chatColor
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
