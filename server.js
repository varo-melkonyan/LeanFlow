const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const http = require('http');
const { Server } = require('socket.io');
const dotenv = require('dotenv');
const User = require('./models/User');
const ChatMessage = require('./models/ChatMessage');

dotenv.config();

const app = express();
const onlineUsers = {};
const socketEmailMap = {};

const corsOptions = {
  origin: 'https://yerevan.me',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-user-email', 'x-user-role'],
  credentials: true
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));
app.use(express.json());

app.get('/api/test', (req, res) => {
  res.json({ message: 'CORS OK ✅' });
});

// 🔗 Routes
app.use('/uploads', express.static('uploads'));
app.use('/api/chat', require('./routes/upload'));
app.use('/api/groupchats', require('./routes/groupChats'));
app.use('/api/users', require('./routes/users'));
app.use('/api/chat', require('./routes/chat'));
app.use('/api/comments', require('./routes/comments'));
app.use('/api/auth', require('./routes/auth')); // ✅ սա բերում է login route-երը
app.use('/api/tickets', require('./routes/tickets'));
app.use('/api/messages', require('./routes/messages'));

const server = http.createServer(app);

// 🔌 Socket.io Setup
const io = new Server(server, {
  cors: {
    origin: 'https://yerevan.me',
    methods: ['GET', 'POST'],
    credentials: true,
    transports: ['websocket', 'polling']
  }
});

app.set('io', io);
app.set('onlineUsers', onlineUsers);

io.on('connection', (socket) => {
  console.log('🔌 Socket connected:', socket.id);
  // ... մնացած socket logic
});

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/leanflow';

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => {
    console.log('✅ MongoDB connected');

    const PORT = process.env.PORT || 5001;
    server.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err);
  });
