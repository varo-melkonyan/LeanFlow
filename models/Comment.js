const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CommentSchema = new Schema({
  ticketId: { type: Schema.Types.ObjectId, ref: 'Ticket', required: true },
  author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  message: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Comment', CommentSchema);
