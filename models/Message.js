const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  content: String,
  ticketId: { type: mongoose.Schema.Types.ObjectId, ref: 'Ticket' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Message', MessageSchema);
