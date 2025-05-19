// server.js
const express = require('express');
const http = require('http');
const cors = require('cors');
const mongoose = require('mongoose');
const { Server } = require('socket.io');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth');

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'https://yerevan.me',
    methods: ['GET', 'POST'],
    credentials: true,
  },
});
console.log('🚀 Server started');
// Միջին ծրագրեր
app.use(cors({
  origin: 'https://yerevan.me',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));
app.use(express.json());
console.log(express.json);
// Երթուղիներ
app.use('/api/auth', authRoutes);

// Socket.IO տրամաբանություն
io.on('connection', (socket) => {
  console.log('🔌 Socket connected:', socket.id);

  socket.on('disconnect', () => {
    console.log('🔌 Socket disconnected:', socket.id);
  });
});

// ՄոնգոԴԲ կապակցում և սերվերի մեկնարկ
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/leanflow';

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log('✅ MongoDB connected');
    const PORT = process.env.PORT || 10000;
    server.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err);
  });
