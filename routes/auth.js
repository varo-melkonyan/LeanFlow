const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const sendActivationEmail = require('../utils/sendActivationEmail');

async function getUniqueChatColor() {
  const usedColors = await User.distinct('chatColor');
  const freeColors = availableColors.filter(c => !usedColors.includes(c));

  if (freeColors.length === 0) {
    return '#7f8c8d'; // fallback գույն
  }

  return freeColors[Math.floor(Math.random() * freeColors.length)];
}


router.post('/register', async (req, res) => {
  try {
    const existingUsers = await User.countDocuments();
    if (existingUsers > 0) {
      return res.status(403).json({ error: 'Registration closed. Only admin can create new users.' });
    }

    const { email, password, name } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      email,
      password: hashedPassword,
      name,
      role: 'admin',
      chatColor: await getUniqueChatColor(),
      activationToken: crypto.randomBytes(32).toString('hex'),
      isActive: false
    });

    await user.save();
    res.status(201).json({ message: 'Admin registered successfully' });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ error: 'Registration failed' });
  }
});

router.get('/login', (req, res) => {
res.json({ message: 'Login endpoint is active. Use POST method.' });
});


router.get('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    console.log('🔐 Logging in:', user?.email, '| isActive:', user?.isActive);
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    if (!user.isActive) {
      return res.status(403).json({ error: 'Account is not activated. Please check your email.' });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

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


router.get('/activate/:token', async (req, res) => {
  const token = req.params.token;
  console.log('🔍 Received token:', token);

  const user = await User.findOne({ activationToken: token });

  if (!user) {
    const activated = await User.findOne({ isActive: true, activationToken: { $exists: false } });
    if (activated) {
      return res.status(410).json({ error: 'Account already activated' });
    }
    return res.status(404).json({ error: 'Invalid or expired token' });
  }

  user.isActive = true;
  user.activationToken = undefined;
  await user.save();

  res.json({ message: 'Account activated successfully' });
});

router.post('/resend-activation', async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (user.isActive) {
      return res.status(400).json({ error: 'Account is already active' });
    }

    // 👇 Նոր token գեներացնենք
    user.activationToken = crypto.randomBytes(32).toString('hex');
    await user.save();

    await sendActivationEmail(email, user.activationToken);

    res.json({ message: 'Activation email sent successfully' });
  } catch (err) {
    console.error('Resend activation error:', err.message);
    res.status(500).json({ error: 'Failed to resend activation email' });
  }
});


module.exports = router;
