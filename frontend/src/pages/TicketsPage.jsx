import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Sidebar from '../components/Sidebar';
import ChatBox from '../components/ChatBox'; // ✅ Live Chat

const TicketsPage = ({ role, setUser }) => {
  const [tickets, setTickets] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [assignedEmail, setAssignedEmail] = useState('');
  const [currentUser, setCurrentUser] = useState(null);
  const [sortOption, setSortOption] = useState('latest');
  const [commentText, setCommentText] = useState('');
  const [commentingTicketId, setCommentingTicketId] = useState(null);
  const apiBase = 'https://leanflow.onrender.com';

  const fetchTickets = async () => {
    try {
      const res = await axios.get('https://leanflow.onrender.com/api/tickets');
      const user = JSON.parse(localStorage.getItem('user'));
      setCurrentUser(user);


      let filtered = res.data;
      if (user.role === 'client') {
        filtered = res.data.filter(t =>
          t.createdBy?._id === user.id || t.assignedTo?._id === user.id
        );
      }

      setTickets(filtered);
    } catch (err) {
      console.error('❌ Failed to fetch tickets:', err);
    }
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const user = JSON.parse(localStorage.getItem('user'));

    await axios.post(`${apiBase}/api/tickets`, {
  title,
  description,
  assignedToEmail: assignedEmail,
  createdBy: user.id,
  status: 'open'
}, {
  headers: {
    'x-user-email': user.email,
    'x-user-role': user.role
  }
});
    setTitle('');
    setDescription('');
    setAssignedEmail('');
    setShowForm(false);
    fetchTickets();
  } catch (err) {
    console.error('❌ Ticket creation failed:', err.response?.data || err.message);
    alert('Failed to create ticket');
  }
};

  const submitComment = async (ticketId) => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));

      if (!commentText.trim()) return;

      await axios.post(`${apiBase}/api/comments`, {
  ticketId,
  authorId: user.id,
  message: commentText.trim()
}, {
  headers: {
    'x-user-email': user.email,
    'x-user-role': user.role
  }
});

      setCommentText('');
      setCommentingTicketId(null);
      fetchTickets();
    } catch (err) {
      console.error('❌ Failed to add comment:', err);
      alert('Failed to post comment');
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const sortedTickets = [...tickets].sort((a, b) => {
    if (sortOption === 'latest') {
      return new Date(b.createdAt) - new Date(a.createdAt);
    } else if (sortOption === 'oldest') {
      return new Date(a.createdAt) - new Date(b.createdAt);
    } else if (sortOption === 'status') {
      return a.status.localeCompare(b.status);
    }
    return 0;
  });

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white">
      <Sidebar role={role} setUser={setUser} />

      <main className="flex-1 p-6 overflow-y-auto relative">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">Tickets</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Logged in as: <strong>{role}</strong>
            </p>
          </div>

          {(role === 'admin' || role === 'support') && (
            <button
              onClick={() => setShowForm(!showForm)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
            >
              {showForm ? 'Cancel' : '+ New Ticket'}
            </button>
          )}
        </div>

        <div className="mb-4 flex justify-end">
          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            className="p-2 border rounded dark:bg-gray-800 dark:text-white"
          >
            <option value="latest">Latest</option>
            <option value="oldest">Oldest</option>
            <option value="status">By Status</option>
          </select>
        </div>

        {showForm && (role === 'admin' || role === 'support') && (
          <form onSubmit={handleSubmit} className="space-y-4 max-w-md mb-8">
            <input
              type="text"
              placeholder="Ticket title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full p-2 border rounded dark:bg-gray-800 dark:text-white"
            />
            <textarea
              placeholder="Describe the issue..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              rows={4}
              className="w-full p-2 border rounded dark:bg-gray-800 dark:text-white"
            />
            <input
              type="email"
              placeholder="Assign to (email)"
              value={assignedEmail}
              onChange={(e) => setAssignedEmail(e.target.value)}
              className="w-full p-2 border rounded dark:bg-gray-800 dark:text-white"
            />
            <button
              type="submit"
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
            >
              Submit Ticket
            </button>
          </form>
        )}

        {sortedTickets.length === 0 ? (
          <p className="text-sm text-gray-500 dark:text-gray-400">No tickets found.</p>
        ) : (
          <div className="grid gap-4">
            {sortedTickets.map((ticket) => (
              <div
                key={ticket._id}
                className="p-4 rounded-lg bg-white dark:bg-gray-800 shadow"
              >
                <h2 className="font-semibold">{ticket.title || 'Untitled Ticket'}</h2>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">
                  Status: {ticket.status}
                </p>
                <p className="text-xs text-gray-400 dark:text-gray-500">
                  Created: {new Date(ticket.createdAt).toLocaleString()}
                </p>

                {ticket.comments?.length > 0 && (
                  <div className="mt-4 border-t pt-2">
                    <h3 className="text-sm font-semibold mb-1 text-gray-600 dark:text-gray-300">
                      Comments:
                    </h3>
                    {ticket.comments.map((comment) => (
                      <div key={comment._id} className="mb-2">
                        <p className="text-sm">
                          <strong>{comment.author?.name || 'Unknown'}:</strong>{' '}
                          {comment.message}
                        </p>
                        <p className="text-xs text-gray-400 dark:text-gray-500">
                          {new Date(comment.createdAt).toLocaleString()}
                        </p>
                      </div>
                    ))}
                  </div>
                )}

                {role === 'client' &&
                  ticket.assignedTo?._id === currentUser?.id && (
                    <div className="mt-2">
                      <textarea
                        rows={2}
                        placeholder="Write a comment..."
                        value={commentingTicketId === ticket._id ? commentText : ''}
                        onFocus={() => setCommentingTicketId(ticket._id)}
                        onChange={(e) => setCommentText(e.target.value)}
                        className="w-full p-2 border rounded dark:bg-gray-900 dark:text-white"
                      />
                      <button
                        className="mt-2 px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                        onClick={() => submitComment(ticket._id)}
                      >
                        Add Comment
                      </button>
                    </div>
                  )}
              </div>
            ))}
          </div>
        )}

        {/* ✅ Live Chat տեղադրված */}
        {currentUser && <ChatBox user={currentUser} />}
        
      </main>
    </div>
  );
};

export default TicketsPage;
