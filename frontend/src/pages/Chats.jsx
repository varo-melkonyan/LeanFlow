// pages/Chats.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';
import SlackLayout from '../layouts/SlackLayout';

const Chats = () => {
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const [newChatName, setNewChatName] = useState('');
  const [newChatEmails, setNewChatEmails] = useState('');
  const user = JSON.parse(localStorage.getItem('user'));

  const socket = io('https://leanflow-backend.onrender.com', {
    transports: ['polling']
  });

  useEffect(() => {
    if (selectedChat) {
      socket.emit('join_group', selectedChat._id);
    }
  }, [selectedChat]);

  useEffect(() => {
    socket.on('group_message', (msg) => {
      const audio = new Audio('/notification.mp3');
      audio.play();

      setChats((prevChats) =>
        prevChats.map((chat) =>
          chat._id === selectedChat?._id
            ? { ...chat, messages: [...chat.messages, msg] }
            : chat
        )
      );
    });
    return () => socket.off('group_message');
  }, [selectedChat]);

  useEffect(() => {
    if (!user) return;
    axios
      .get('https://leanflow-backend.onrender.com/api/groupchats', {
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
    const emails = newChatEmails.split(',').map((e) => e.trim());
    if (!emails.includes(user.email)) emails.push(user.email);

    try {
      const res = await axios.post('https://leanflow-backend.onrender.com/api/groupchats', {
        name: newChatName,
        participants: emails
      });

      setChats((prev) => [...prev, res.data]);
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
        `https://leanflow-backend.onrender.com/api/groupchats/${selectedChat._id}/message`,
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

  const handleReaction = (msg, emoji) => {
    setChats((prevChats) =>
      prevChats.map((chat) => {
        if (chat._id === selectedChat._id) {
          const updatedMessages = chat.messages.map((m) => {
            if (m === msg) {
              const reactions = { ...m.reactions };
              reactions[emoji] = (reactions[emoji] || 0) + 1;
              return { ...m, reactions };
            }
            return m;
          });
          return { ...chat, messages: updatedMessages };
        }
        return chat;
      })
    );
  };

  return (
    <SlackLayout topbar={<h2 className="font-semibold text-lg">💬 Group Chats</h2>}>
      <div className="flex gap-6 h-full">
        <div className="w-64 border-r border-[#3a3b40] pr-4">
          <h2 className="text-md font-semibold mb-4">💡 Create New Chat</h2>
          <input
            type="text"
            placeholder="Chat name"
            value={newChatName}
            onChange={(e) => setNewChatName(e.target.value)}
            className="bg-[#2e2f34] text-white p-2 rounded w-full mb-2 outline-none"
          />
          <input
            type="text"
            placeholder="Participant emails (comma separated)"
            value={newChatEmails}
            onChange={(e) => setNewChatEmails(e.target.value)}
            className="bg-[#2e2f34] text-white p-2 rounded w-full mb-2 outline-none"
          />
          <button
            onClick={handleCreateGroup}
            className="px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700 w-full"
          >
            ➕ Create Group Chat
          </button>

          <h3 className="mt-6 mb-2 font-bold text-sm text-gray-300">Your Chats</h3>
          <div className="space-y-2">
            {chats.map((chat) => (
              <div
                key={chat._id}
                onClick={() => setSelectedChat(chat)}
                className={`p-3 rounded cursor-pointer ${
                  selectedChat?._id === chat._id ? 'bg-[#3f4050]' : 'hover:bg-[#3a3b40]'
                }`}
              >
                <div className="font-semibold">{chat.name}</div>
                <div className="text-xs text-gray-400">
                  {chat.participants.join(', ')}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex-1 flex flex-col">
          {selectedChat ? (
            <>
              <div className="flex-1 overflow-y-auto bg-[#2e2f34] rounded-md p-4 space-y-3">
                {[...selectedChat.messages].map((msg, idx) => {
                  const isCurrentUser = msg.sender === user.email;
                  return (
                    <div
                      key={idx}
                      className="group flex gap-3 items-start hover:bg-[#3f4048] p-3 rounded-md transition relative"
                    >
                      <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold uppercase">
                        {msg.sender[0]}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-white">{msg.sender}</span>
                          <span className="text-xs text-gray-400">{new Date(msg.timestamp).toLocaleTimeString()}</span>
                        </div>
                        <div className="text-sm text-gray-200 mt-1">{msg.text}</div>
                        {msg.reactions && Object.entries(msg.reactions).map(([emoji, count]) => (
                          <span
                            key={emoji}
                            className="inline-flex items-center text-sm bg-[#4c4d50] px-2 py-1 rounded-full mr-1 mt-2"
                          >
                            {emoji} {count}
                          </span>
                        ))}
                      </div>
                      <div className="absolute right-3 top-2 opacity-0 group-hover:opacity-100 flex gap-2 text-gray-400 text-sm transition">
                        <button title="Reply">💬</button>
                        <button title="React" onClick={() => handleReaction(msg, '😊')}>😊</button>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="mt-3 flex">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                  className="flex-1 bg-[#3a3b40] text-white p-2 rounded-full focus:outline-none"
                  placeholder="Type your message..."
                />
                <button
                  onClick={sendMessage}
                  className="ml-2 px-4 py-2 bg-blue-600 rounded-full hover:bg-blue-700"
                >
                  Send
                </button>
              </div>
            </>
          ) : (
            <div className="text-gray-400 mt-10 text-center">
              Select a chat to view messages
            </div>
          )}
        </div>
      </div>
    </SlackLayout>
  );
};

export default Chats;
