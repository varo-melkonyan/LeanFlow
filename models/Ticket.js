const mongoose = require('mongoose');

const TicketSchema = new mongoose.Schema({
  title: String,
  description: String,
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
  status: {
    type: String,
    enum: ['open', 'in_progress', 'closed'],
    default: 'open'
  },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  history: [
    {
      type: {
        type: String,
        enum: ['edit', 'complete', 'reopen'],
      },
      timestamp: { type: Date, default: Date.now }
    }
  ]
}, {
  timestamps: true // ✅ սա կավելացնի createdAt և updatedAt ավտոմատ
});

module.exports = mongoose.model('Ticket', TicketSchema);
