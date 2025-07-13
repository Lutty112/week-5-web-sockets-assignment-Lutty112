const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    content: { type: String, required: true },
    room: { type: mongoose.Schema.Types.ObjectId, ref: 'Room' },
    isPrivate: { type: Boolean, default: false },
    recipients: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    readBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    reactions: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        emoji: { type: String }, // e.g., '❤️', '👍'
      }
    ]
  },
  { timestamps: true }
);

module.exports = mongoose.model('Message', messageSchema);

