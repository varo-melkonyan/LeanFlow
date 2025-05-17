const express = require('express');
const router = express.Router();
const Message = require('../models/Message');

// Ստեղծել հաղորդագրություն
router.post('/', async (req, res) => {
  try {
    const message = new Message(req.body);
    await message.save();
    res.status(201).json(message);
  } catch (err) {
    res.status(400).json({ error: 'Failed to send message' });
  }
});

// Վերցնել հաղորդագրություններ ticket-ի համար
router.get('/:ticketId', async (req, res) => {
  try {
    const messages = await Message.find({ ticketId: req.params.ticketId }).populate('sender');
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

module.exports = router;
