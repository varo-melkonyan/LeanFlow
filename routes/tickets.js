const express = require('express');
const router = express.Router();
const Ticket = require('../models/Ticket');
const User = require('../models/User');

// ✅ GET all tickets
router.get('/', async (req, res) => {
  try {
    const tickets = await Ticket.find()
      .sort({ status: 1, createdAt: -1 })
      .populate('createdBy', 'name email')
      .populate('assignedTo', 'name email')
      .populate({
        path: 'comments',
        populate: { path: 'author', select: 'name email' }
      });

    res.json(tickets);
  } catch (err) {
    console.error('❌ Failed to fetch tickets:', err);
    res.status(500).json({ error: 'Failed to fetch tickets' });
  }
});

// ✅ POST create ticket
router.post('/', async (req, res) => {
  try {
    const { title, description, createdBy, assignedToEmail, status } = req.body;

    console.log('📥 Ticket creation request:', req.body);

    if (!title || !description || !createdBy) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    let assignedTo = null;

    if (assignedToEmail) {
      const assignedUser = await User.findOne({ email: assignedToEmail });
      if (!assignedUser) {
        return res.status(404).json({ error: 'Assigned user not found by email' });
      }
      assignedTo = assignedUser._id;
    }

    const newTicket = new Ticket({
      title,
      description,
      createdBy,
      assignedTo,
      status: (status || 'open').toLowerCase(),
    });

    await newTicket.save();

    console.log('✅ Ticket saved:', newTicket);

    res.status(201).json(newTicket);
  } catch (err) {
    console.error('❌ Error saving ticket:', err);
    res.status(500).json({ error: 'Failed to create ticket' });
  }
});

// ✅ Update ticket (status, title, description)
router.put('/:id', async (req, res) => {
  try {
    const { status, title, description } = req.body;
    const update = {};
    if (status) update.status = status;
    if (title) update.title = title;
    if (description) update.description = description;

    const updated = await Ticket.findByIdAndUpdate(req.params.id, update, { new: true });
    res.json(updated);
  } catch (err) {
    console.error('❌ Ticket update error:', err);
    res.status(500).json({ error: 'Update failed' });
  }
});

// ✅ Delete ticket by ID
router.delete('/:id', async (req, res) => {
  try {
    await Ticket.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (err) {
    console.error('❌ Ticket deletion error:', err);
    res.status(500).json({ error: 'Delete failed' });
  }
});

module.exports = router;
