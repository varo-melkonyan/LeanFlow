const express = require('express');
const router = express.Router();
const Comment = require('../models/Comment');
const Ticket = require('../models/Ticket');

router.post('/', async (req, res) => {
  try {
    const { ticketId, authorId, message } = req.body;

    if (!ticketId || !authorId || !message) {
      return res.status(400).json({ error: 'Missing fields' });
    }

    const comment = new Comment({ ticketId, author: authorId, message });
    await comment.save();

    // Push comment to ticket
    await Ticket.findByIdAndUpdate(ticketId, {
      $push: { comments: comment._id },
    });

    const populated = await comment.populate('author', 'name email');

    res.status(201).json(populated);
  } catch (err) {
    console.error('❌ Comment error:', err);
    res.status(500).json({ error: 'Failed to post comment' });
  }
});

module.exports = router;
