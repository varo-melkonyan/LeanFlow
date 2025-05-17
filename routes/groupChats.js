const express = require('express');
const router = express.Router();
const GroupChat = require('../models/GroupChat');

// ✅ Get all group chats relevant to user
router.get('/', async (req, res) => {
  const email = req.headers['x-user-email'];
  const role = req.headers['x-user-role'];

  try {
    const chats = role === 'admin'
      ? await GroupChat.find()
      : await GroupChat.find({ participants: email });

    res.json(chats);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch chats' });
  }
});

// ✅ Create a new group chat
router.post('/', async (req, res) => {
  const { name, participants } = req.body;

  try {
    const chat = new GroupChat({ name, participants });
    await chat.save();
    res.status(201).json(chat);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create chat' });
  }
});

// ✅ Add message to group
router.post('/:id/message', async (req, res) => {
  const { sender, text } = req.body;
  try {
    const chat = await GroupChat.findById(req.params.id);
    if (!chat) return res.status(404).json({ error: 'Chat not found' });

    chat.messages.push({ sender, text });
    await chat.save();
    res.json(chat);
  } catch (err) {
    res.status(500).json({ error: 'Failed to send message' });
  }
});

module.exports = router;
