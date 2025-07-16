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
  const { name, description } = req.body;  
  const createdBy = req.user.id;  // get creator from authenticated user

  console.log('Room create request:', { name, description, createdBy });

  if (!name || !createdBy) {
    return res.status(400).json({ error: 'Room name and creator are required' });
  }

  try {
    const existing = await Room.findOne({ name });
    if (existing) {
      return res.status(400).json({ error: 'Room already exists' });
    }

    const room = await Room.create({ name, description, createdBy });
    res.status(201).json(room);
  } catch (error) {
    console.error('Room creation error:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
};
