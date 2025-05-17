const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ChatMessageSchema = new Schema({
  sender: { type: String, required: true },
  text: { type: String, required: true },
  time: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ChatMessage', ChatMessageSchema);
