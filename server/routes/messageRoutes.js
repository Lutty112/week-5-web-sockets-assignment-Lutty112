const express = require('express');
const router = express.Router();
const { getRoomMessages, sendMessage, searchMessages } = require('../controllers/messageController');
const multer = require('multer');
const path = require('path');

// Multer storage config
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'uploads/');
  },
  filename(req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

router.get('/search', searchMessages);
router.post('/upload', upload.single('image'), (req, res) => {
  const filePath = `/uploads/${req.file.filename}`;
  res.status(201).json({ url: filePath });
});
router.post('/', sendMessage);
router.get('/:roomId', getRoomMessages);


module.exports = router;
