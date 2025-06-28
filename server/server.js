require('dotenv').config(); // ✅ Load .env variables
const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');
const mongoose = require('mongoose');

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;


// 🧠 In-memory room store
let rooms = {};

// REST API
app.post('/api/rooms/join', (req, res) => {
  const { roomId } = req.body;
  if (!rooms[roomId]) {
    rooms[roomId] = { drawingData: [] };
  }
  res.json({ success: true, roomId });
});

app.get('/api/rooms/:roomId', (req, res) => {
  const roomId = req.params.roomId;
  res.json({ drawingData: rooms[roomId]?.drawingData || [] });
});

// SOCKET.IO
io.on('connection', (socket) => {
  console.log('🟢 User connected:', socket.id);

  // 🔹 User joins a room
  socket.on('join-room', ({ roomId }) => {
    socket.join(roomId);
    console.log(`User ${socket.id} joined room: ${roomId}`);

    // 🧠 Send previous drawing
    if (rooms[roomId]) {
      socket.emit('load-drawing', rooms[roomId].drawingData);
    }

    // 🔸 Broadcast user count
    const roomSockets = io.sockets.adapter.rooms.get(roomId);
    const userCount = roomSockets ? roomSockets.size : 0;
    io.to(roomId).emit('user-count', userCount);
  });

  // 🔹 Cursor position sharing
  socket.on('cursor-move', ({ roomId, cursor }) => {
    socket.to(roomId).emit('cursor-update', { id: socket.id, cursor });
  });

  // 🔹 Drawing events
  socket.on('draw-start', (data) => {
    const { roomId } = data;
    rooms[roomId]?.drawingData.push({ type: 'start', data });
    socket.to(roomId).emit('draw-start', data);
  });

  socket.on('draw-move', (data) => {
    const { roomId } = data;
    rooms[roomId]?.drawingData.push({ type: 'move', data });
    socket.to(roomId).emit('draw-move', data);
  });

  socket.on('draw-end', (data) => {
    const { roomId } = data;
    rooms[roomId]?.drawingData.push({ type: 'end', data });
    socket.to(roomId).emit('draw-end', data);
  });

  socket.on('clear-canvas', ({ roomId }) => {
    if (rooms[roomId]) {
      rooms[roomId].drawingData.push({ type: 'clear', data: {} });
      rooms[roomId].drawingData = []; // Clear stored drawing too
    }
    socket.to(roomId).emit('clear-canvas');
  });

  // 🔹 User leaves
  socket.on('disconnect', () => {
    console.log('🔴 User disconnected:', socket.id);

    // 🔸 Update user count for all rooms the socket was in
    socket.rooms.forEach((roomId) => {
      if (roomId !== socket.id) {
        const roomSockets = io.sockets.adapter.rooms.get(roomId);
        const userCount = roomSockets ? roomSockets.size - 1 : 0;
        io.to(roomId).emit('user-count', userCount);
        io.to(roomId).emit('user-left', socket.id);
      }
    });
  });
});

// 🔌 Connect MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// 🚀 Start server
server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
