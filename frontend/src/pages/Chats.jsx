import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';


const Chats = () => {
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const user = JSON.parse(localStorage.getItem('user'));
  const [newChatName, setNewChatName] = useState('');
  const [newChatEmails, setNewChatEmails] = useState('');

const socket = io('https://leanflow.onrender.com', {
  transports: ['polling'], 
});

  useEffect(() => {
  if (selectedChat) {
    socket.emit('join_group', selectedChat._id);
  }
}, [selectedChat]);

useEffect(() => {
  socket.on('group_message', (msg) => {
    setChats((prevChats) =>
      prevChats.map((chat) =>
        chat._id === selectedChat?._id
          ? { ...chat, messages: [...chat.messages, msg] }
          : chat
      )
    );
  });

  return () => {
    socket.off('group_message');
  };
}, [selectedChat]);

  useEffect(() => {
    if (!user) return;
    axios
      .get('https://leanflow.onrender.com/api/groupchats', {
        headers: {
          'x-user-email': user.email,
          'x-user-role': user.role
        }
      })
      .then((res) => setChats(res.data))
      .catch((err) => console.error('Fetch chats failed:', err));
  }, [user]);

  const handleCreateGroup = async () => {
  if (!newChatName || !newChatEmails) return alert('Please fill all fields');

  const emails = newChatEmails.split(',').map(e => e.trim());
  if (!emails.includes(user.email)) emails.push(user.email); 

  try {
    const res = await await fetch(`${apiBase}/api/groupchats`, {
      name: newChatName,
      participants: emails
    });

    setChats(prev => [...prev, res.data]);
    setNewChatName('');
    setNewChatEmails('');
    alert('✅ Group chat created');
  } catch (err) {
    console.error('Create group error:', err);
    alert('❌ Failed to create group');
  }
};

  const sendMessage = async () => {
  if (!newMessage.trim()) return;

  const msg = {
    sender: user.email,
    text: newMessage.trim(),
    timestamp: new Date().toISOString(),
  };

  try {
    await axios.post(
      `https://leanflow.onrender.com/api/groupchats/${selectedChat._id}/message`,
      msg
    );

    socket.emit('group_message', {
      groupId: selectedChat._id,
      message: msg
    });

    setChats((prev) =>
      prev.map((chat) =>
        chat._id === selectedChat._id
          ? { ...chat, messages: [...chat.messages, msg] }
          : chat
      )
    );

    setNewMessage('');
  } catch (err) {
    console.error('Send message error:', err);
  }
};


  return (
    <div className="p-6 flex gap-6">
      {/* Sidebar */}
      <div className="w-1/3 border-r pr-4">
        <h2 className="text-xl font-bold mb-4">Your Chats</h2>
        <div className="mb-4">
  <input
    type="text"
    placeholder="Chat name"
    value={newChatName}
    onChange={(e) => setNewChatName(e.target.value)}
    className="border p-1 rounded w-full mb-2"
  />
  <input
    type="text"
    placeholder="Participant emails (comma separated)"
    value={newChatEmails}
    onChange={(e) => setNewChatEmails(e.target.value)}
    className="border p-1 rounded w-full mb-2"
  />
  <button
    onClick={handleCreateGroup}
    className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
  >
    ➕ Create Group Chat
  </button>
</div>
        {chats.map((chat) => (
          <div
            key={chat._id}
            onClick={() => setSelectedChat(chat)}
            className={`p-3 rounded cursor-pointer mb-2 ${selectedChat?._id === chat._id ? 'bg-blue-100' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}
          >
            <div className="font-semibold">{chat.name}</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {chat.participants.join(', ')}
            </div>
          </div>
        ))}
      </div>

      {/* Chat Box */}
      <div className="flex-1">
        {selectedChat ? (
          <div className="flex flex-col h-full">
            <h2 className="text-lg font-bold mb-2">{selectedChat.name}</h2>
            <div className="border rounded p-3 flex-1 overflow-y-auto h-[400px] flex flex-col-reverse">
              {[...selectedChat.messages].reverse().map((msg, idx) => (
                <div key={idx} className="mb-2">
                  <strong>{msg.sender}</strong>: {msg.text}
                  <div className="text-xs text-gray-400">{new Date(msg.timestamp).toLocaleTimeString()}</div>
                </div>
              ))}
            </div>
            <div className="flex mt-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                className="flex-1 p-2 rounded border"
                placeholder="Type your message..."
                style={{ width: 'auto' }}
              />
              <button
                onClick={sendMessage}
                className="ml-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                style={{ width: 'auto' }}
              >
                Send
              </button>
            </div>
          </div>
        ) : (
          <div className="text-gray-500 dark:text-gray-400">Select a chat to view messages</div>
        )}
      </div>
    </div>
  );
};

export default Chats;
