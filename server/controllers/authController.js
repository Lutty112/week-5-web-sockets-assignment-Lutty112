const jwt = require('jsonwebtoken');
const User = require('../models/User');
const bcrypt = require('bcrypt');

// Generate JWT token
const generateToken = (user) => {
  return jwt.sign({ id: user._id, username: user.username }, process.env.JWT_SECRET, {
    expiresIn: '3hrs',
  });
};

exports.registerUser = async (req, res) => {
  const { username, password } = req.body;

  try {
    let existing = await User.findOne({ username });
    if (existing) return res.status(400).json({ error: "Username already exists" });

    const user = await User.create({ username, password });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '3hrs' });
    res.status(201).json({ user, token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.loginUser = async (req, res) => {
   console.log('Login request received:', req.body);
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ error: "Invalid username or password" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: "Invalid username or password" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '3hrs' });
    res.status(200).json({ user, token });
  } catch (error) {
  console.error('Login error:', error);  
  res.status(500).json({ error: error.message });
}
};
