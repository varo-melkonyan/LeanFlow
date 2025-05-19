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
app.use('/api/auth', require('./routes/auth'));
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

  socket.on('userOnline', async (email) => {
    socketEmailMap[socket.id] = email;
    await User.findOneAndUpdate({ email }, { isOnline: true });
  });

  socket.on('join_group', (groupId) => {
    socket.join(groupId);
    console.log(`👥 Socket ${socket.id} joined group ${groupId}`);
  });

  socket.on('group_message', ({ groupId, message }) => {
    io.to(groupId).emit('group_message', message);
  });

  socket.on('registerUser', (email) => {
    onlineUsers[email] = socket.id;
    console.log('📥 Registered user:', email, socket.id);
  });

  socket.on('send_message', async (data) => {
    try {
      const saved = new ChatMessage(data);
      await saved.save();
      socket.broadcast.emit('receive_message', data);
    } catch (err) {
      console.error('❌ Failed to save chat message:', err);
    }
  });

  socket.on('disconnect', async () => {
    const email = socketEmailMap[socket.id];
    if (email) {
      await User.findOneAndUpdate({ email }, { isOnline: false });
      delete socketEmailMap[socket.id];
    }

    for (const mail in onlineUsers) {
      if (onlineUsers[mail] === socket.id) {
        delete onlineUsers[mail];
        break;
      }
    }

    console.log('🔌 Socket disconnected:', socket.id);
  });
});

// 🛢️ MongoDB + Start server
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

module.exports = router