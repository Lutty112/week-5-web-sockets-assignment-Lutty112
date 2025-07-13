const Room = require('../models/Room');


// Get all chat rooms
exports.getRooms = async (req, res) => {
  try {
    const rooms = await Room.find().populate('createdBy', 'username');
    res.json(rooms);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch rooms' });
  }
};

// Create a new chat room
exports.createRoom = async (req, res) => {
  const { name, description, createdBy } = req.body;

  try {
    const existing = await Room.findOne({ name });
    if (existing) {
      return res.status(400).json({ error: 'Room already exists' });
    }

    const room = await Room.create({ name, description, createdBy });
    res.status(201).json(room);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create room' });
  }
};
