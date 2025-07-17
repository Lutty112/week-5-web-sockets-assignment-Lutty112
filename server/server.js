
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const connectDB = require("./config/db");

dotenv.config();

const app = express();
const server = http.createServer(app);

// Allow only frontend on Vercel to connect
const allowedOrigins = [
  'https://week-5-web-sockets-assignment-lutty.vercel.app',
  'http://localhost:5173',
  ];

// CORS for Express
app.use(cors({
  origin: allowedOrigins,
  credentials: true,
}));

// CORS for Socket.io
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Socket.IO events
require('./socket')(io);

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// API routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/rooms", require("./routes/roomRoutes"));
app.use("/api/messages", require("./routes/messageRoutes"));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Connect DB and start server
connectDB();

const PORT = process.env.PORT || 5000;
server.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Server running on http://0.0.0.0:${PORT}`);
});
