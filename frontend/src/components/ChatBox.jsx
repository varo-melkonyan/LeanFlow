import React, { useEffect, useState, useRef } from 'react';
import { io } from 'socket.io-client';
import axios from 'axios';

const socket = io('https://leanflow.onrender.com');

const ChatBox = ({ user }) => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [userColors, setUserColors] = useState({});
  const userRef = useRef(user);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);


const handleFileUpload = async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const formData = new FormData();
  formData.append('file', file);

  try {
    const res = await fetch(`${apiBase}/api/chat/upload`, formData);
    const fileUrl = res.data.url;

    const msg = {
      sender: user.name,
      text: file.type.startsWith('image/')
        ? `<img src="${fileUrl}" class="max-w-[150px] rounded" />`
        : `<a href="${fileUrl}" target="_blank" class="text-blue-600 underline">${file.name}</a>`,
      time: new Date().toLocaleTimeString(),
    };
console.log('📤 Sending file message:', msg);

    socket.emit('send_message', msg);

    setMessages((prev) => [...prev, msg]);

    e.target.value = '';
  } catch (err) {
    console.error('📎 File upload failed:', err);
  }
};


  useEffect(() => {
    userRef.current = user;
  }, [user]);

  // 🎨 Գույն գեներացնող ըստ անունի
  const generateColorFromName = (name) => {
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    const color = `hsl(${hash % 360}, 70%, 60%)`;
    return color;
  };

  const getUserColor = (senderEmail) => {
  const user = users.find(u => u.email === senderEmail);
  return user?.chatColor || '#000000';
};


  useEffect(() => {
    const fetchUserColors = async () => {
      try {
        const res = await axios.get('https://leanflow.onrender.com/api/users');
        const map = {};
        res.data.forEach(u => {
          map[u.name] = u.chatColor || generateColorFromName(u.name);
        });
        setUserColors(map);
      } catch (err) {
        console.error('❌ Failed to fetch user colors:', err);
      }
    };

    fetchUserColors();

const playNotificationSound = () => {
  const audio = new Audio('/notification.mp3');
  audio.play().catch(err => console.log('Sound blocked:', err));
};

const flashChatButton = () => {
  const button = document.getElementById('chat-button');
  if (button) {
    button.classList.add('ring', 'ring-blue-400');
    setTimeout(() => button.classList.remove('ring', 'ring-blue-400'), 1500);
  }
};

    const fetchHistory = async () => {
      try {
        const res = await axios.get('https://leanflow.onrender.com/api/chat');
        setMessages(res.data);
      } catch (err) {
        console.error('❌ Failed to load chat history:', err);
      }
    };

    fetchHistory();

    socket.on('receive_message', (data) => {
      setMessages((prev) => [...prev, data]);
      if (!isOpen) {
    playNotificationSound();
    flashChatButton();
  }
    });

    return () => {
      socket.off('receive_message');
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = () => {
    const currentUser = userRef.current;
    if (!currentUser || !currentUser.name || !message.trim()) return;

    const msgData = {
      sender: currentUser.name,
      text: message.trim(),
      time: new Date().toLocaleTimeString(),
    };

    socket.emit('send_message', msgData);
    setMessages((prev) => [...prev, msgData]);
    setMessage('');
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 text-sm font-sans">
      {isOpen ? (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg w-80 max-h-[70vh] flex flex-col border border-gray-200 dark:border-gray-700">
          {/* Header */}
          <div className="bg-blue-600 text-white px-4 py-2 rounded-t-xl flex justify-between items-center">
            <span className="flex items-center gap-2 text-base font-semibold">
              💬 Live Chat
            </span>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white hover:text-gray-300 transition text-xl font-bold"
              title="Minimize"
              style={{ width: 'auto' }}
            >
              &minus;
            </button>
          </div>

          {/* Messages */}
          <div className="p-3 overflow-y-auto flex-1 flex flex-col-reverse space-y-2 space-y-reverse scroll-smooth">
  {[...messages].reverse().map((msg, idx) => (
    <div key={idx}>
      <div>
  <strong style={{ color: userColors[msg.sender] || '#3b82f6' }}>
    {msg.sender}:
  </strong>{' '}
  <span dangerouslySetInnerHTML={{ __html: msg.text }} />
</div>
      <div className="text-xs text-gray-400 dark:text-gray-500">{msg.time}</div>
    </div>
  ))}
</div>


          {/* Input */}
          <div className="flex p-2 border-t border-gray-200 dark:border-gray-700">
            <button
    onClick={() => fileInputRef.current?.click()}
    className="text-xl"
    title="Attach file"
  >
    📎
  </button>
  <input
  type="file"
  ref={fileInputRef} 
  onChange={handleFileUpload}
  style={{ display: 'none' }}
  accept=".png,.jpg,.jpeg,.pdf"
/>
            <input
              type="text"
              placeholder="Type your message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
              className="flex-1 p-2 rounded border dark:bg-gray-700 dark:text-white focus:outline-none"
              style={{ width: 'auto' }}
            />
            <button
              onClick={sendMessage}
              className="ml-2 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
              style={{ width: 'auto' }}
            >
              Send
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-full shadow hover:bg-blue-700"
          id="chat-button"
        >
          💬
        </button>
      )}
    </div>
  );
};

export default ChatBox;
