const mongoose = require('mongoose');
const Message = require('../models/Message');
const Room = require('../models/Room');

exports.getRoomMessages = async (req, res) => {
  try {
    const room = await Room.findOne({ name: req.params.roomId });
    if (!room) return res.status(404).json({ error: 'Room not found' });

    const messages = await Message.find({ room: room._id })
      .populate('sender', 'username')
      .sort({ createdAt: 1 })
      .skip(Number(req.query.skip || 0))
      .limit(Number(req.query.limit || 20));

    res.json(messages);
  } catch (err) {
    console.error('Error fetching messages:', err);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
};

// Send a message
exports.sendMessage = async (req, res) => {
  const { content, sender, room, isPrivate, recipients, readBy, reactions, type } = req.body;

  try {
    if (typeof content !== 'string' || !content.trim()) {
      return res.status(400).json({ error: 'Content must be a non-empty string' });
    }

    // Convert room to ObjectId if string
    const roomId = typeof room === 'string' ? mongoose.Types.ObjectId(room) : (room?._id || room);

    const message = new Message({
      content,
      sender,
      room: roomId,
      isPrivate: !!isPrivate,
      recipients: recipients || [],
      readBy: readBy || [],
      reactions: reactions || [],
      type: type || 'text'
    });

    await message.save();
    res.status(201).json(message);
  } catch (err) {
    console.error('Error sending message:', err);
    res.status(500).json({ error: 'Failed to send message' });
  }
};

// Search messages by room id and search term in content
exports.searchMessages = async (req, res) => {
  const { room, term } = req.query;

  try {
    if (!room || !term) {
      return res.status(400).json({ error: 'Room and search term are required' });
    }

    const roomId = mongoose.Types.ObjectId(room);

    const messages = await Message.find({
      room: roomId,
      content: { $regex: term, $options: 'i' }
    }).populate('sender', 'username');

    res.json(messages);
  } catch (err) {
    console.error('Search messages error:', err);
    res.status(500).json({ error: 'Search failed' });
  }
};
