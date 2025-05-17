const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');
const availableColors = [
  '#ff0000', '#00ff00', '#0000ff', '#ffa500', '#800080',
  '#ffc0cb', '#ffff00', '#808080', '#008080', '#000000'
];

const getUniqueChatColor = async () => {
  const users = await User.find({}, 'chatColor');
  const usedColors = users.map(u => u.chatColor);
  const available = availableColors.filter(c => !usedColors.includes(c));
  return available.length > 0
    ? available[Math.floor(Math.random() * available.length)]
    : '#808080'; // fallback if all colors used
};
const crypto = require('crypto');
const sendActivationEmail = require('../utils/sendActivationEmail');

// GET all users
router.get('/', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching users' });
  }
});
router.put('/:id', async (req, res) => {
  try {
    const { name, email } = req.body;
    const updated = await User.findByIdAndUpdate(
      req.params.id,
      { name, email },
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    console.error('Edit user error:', err);
    res.status(500).json({ error: 'Failed to update user' });
  }
});

router.put('/:id/role', async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role: req.body.role },
      { new: true }
    );

    // 🔥 Live logout Socket.IO-ով
    const io = req.app.get('io');
    const onlineUsers = req.app.get('onlineUsers');
    const socketId = onlineUsers[user.email];

    if (io && socketId) {
      io.to(socketId).emit('forceLogout');
      console.log('📢 Sent forceLogout to:', user.email);
    }

    res.json(user);
  } catch (err) {
    console.error('❌ Role update error:', err);
    res.status(500).json({ error: 'Error updating role' });
  }
});


router.get('/by-email/:email', async (req, res) => {
  try {
    const user = await User.findOne({ email: req.params.email });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching user' });
  }
});

router.put('/:id/color', async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { chatColor: req.body.color },
      { new: true }
    );
    res.json(user);
  } catch (err) {
    console.error('Error updating color:', err);
    res.status(500).json({ error: 'Failed to update color' });
  }
});

router.post('/create', async (req, res) => {
  try {
    const { email, password = '123456', name, role = 'client' } = req.body;
    const requesterEmail = req.headers['x-user-email'];
    const creator = await User.findOne({ email: requesterEmail });

    if (!creator) return res.status(403).json({ error: 'Invalid creator' });
    if (creator.role === 'support' && role !== 'client') {
      return res.status(403).json({ error: 'Support can only create clients' });
    }

    const existing = await User.findOne({ email });
    if (existing) return res.status(409).json({ error: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const activationToken = crypto.randomBytes(32).toString('hex');

    const newUser = new User({
      email,
      password: hashedPassword,
      name,
      role,
      isActive: false,
      activationToken,
      chatColor: await getUniqueChatColor()
    });

    await newUser.save();

    await sendActivationEmail(email, activationToken);

    res.status(201).json({ message: 'User created and activation email sent' });
  } catch (err) {
    console.error('Create user error:', err);
    res.status(500).json({ error: 'Failed to create user' });
  }
});


router.delete('/:id', async (req, res) => {
  try {
    const requesterEmail = req.headers['x-user-email'];
    const requester = await User.findOne({ email: requesterEmail });

    if (!requester) return res.status(403).json({ error: 'Unauthorized' });

    const targetUser = await User.findById(req.params.id);
    if (!targetUser) return res.status(404).json({ error: 'User not found' });

    if (targetUser.role === 'admin') {
      return res.status(403).json({ error: 'Cannot delete admin users' });
    }

    if (targetUser.role === 'support' && requester.role !== 'admin') {
      return res.status(403).json({ error: 'Only admin can delete support users' });
    }

    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted' });
  } catch (err) {
    console.error('❌ Delete user error:', err);
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

module.exports = router;
