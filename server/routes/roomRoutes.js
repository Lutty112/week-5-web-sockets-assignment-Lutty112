const express = require('express');
const router = express.Router();
const { getRooms, createRoom } = require('../controllers/roomController');
const authenticateToken = require('../middleware/authmiddleware');



router.get('/', getRooms);
router.post('/', authenticateToken, createRoom);

module.exports = router;