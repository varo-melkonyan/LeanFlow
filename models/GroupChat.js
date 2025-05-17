const mongoose = require('mongoose');

const GroupChatSchema = new mongoose.Schema({
  name: { type: String, required: true },
  participants: [String], // email list
  messages: [
    {
      sender: String,
      text: String,
      timestamp: { type: Date, default: Date.now }
    }
  ]
}, { timestamps: true });

module.exports = mongoose.model('GroupChat', GroupChatSchema);
