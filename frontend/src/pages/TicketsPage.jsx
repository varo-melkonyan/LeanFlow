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
  const [editingTicket, setEditingTicket] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editAssignedEmail, setEditAssignedEmail] = useState('');
  const [openTicketId, setOpenTicketId] = useState(null);

  const openEditModal = (ticket) => {
    setEditingTicket(ticket);
    setEditTitle(ticket.title);
    setEditDescription(ticket.description);
    setEditAssignedEmail(ticket.assignedTo?.email || '');
  };

  const toggleTicketOpen = (ticketId) => {
    setOpenTicketId(prev => (prev === ticketId ? null : ticketId));
  };

  const fetchTickets = async () => {
    try {
      const res = await axios.get(`${apiBase}/api/tickets`);
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
    if (sortOption === 'latest') return new Date(b.createdAt) - new Date(a.createdAt);
    if (sortOption === 'oldest') return new Date(a.createdAt) - new Date(b.createdAt);
    if (sortOption === 'status') return a.status.localeCompare(b.status);
    return 0;
  });

  const toggleComplete = async (ticketId, currentStatus) => {
    const newStatus = currentStatus === 'completed' ? 'open' : 'completed';
    try {
      await axios.put(`${apiBase}/api/tickets/${ticketId}`, {
        status: newStatus
      });
      fetchTickets();
    } catch (err) {
      console.error('❌ Failed to toggle status:', err);
      alert('Failed to update status');
    }
  };

  const deleteTicket = async (id) => {
    if (!window.confirm('Are you sure you want to delete this ticket?')) return;
    try {
      await axios.delete(`${apiBase}/api/tickets/${id}`, {
        headers: {
          'x-user-email': currentUser.email,
          'x-user-role': currentUser.role
        }
      });
      fetchTickets();
    } catch (err) {
      console.error('❌ Failed to delete ticket:', err);
      alert('Failed to delete');
    }
  };

  const editTicket = (ticket) => {
    openEditModal(ticket);
  };

  const handleEditSubmit = async () => {
    if (!editTitle || !editDescription) return alert('Title and description required');
    try {
      const update = {
        title: editTitle,
        description: editDescription,
        status: editingTicket.status
      };
      if (editAssignedEmail) {
        const res = await axios.get(`${apiBase}/api/users/by-email/${editAssignedEmail}`);
        update.assignedTo = res.data._id;
      }
      await axios.put(`${apiBase}/api/tickets/${editingTicket._id}`, update);
      setEditingTicket(null);
      fetchTickets();
    } catch (err) {
      console.error('❌ Edit failed:', err);
      alert('Failed to update ticket. Check email or try again later.');
    }
  };

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
                className="p-3 bg-white dark:bg-gray-800 shadow rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
              >
                <div
                  onClick={() => toggleTicketOpen(ticket._id)}
                  className="cursor-pointer flex justify-between items-center"
                >
                  <h2 className="font-semibold text-base flex items-center gap-2">
  {ticket.title}
  {ticket.status === 'completed' && (
    <span className="text-green-600 text-sm font-medium">✅ Completed</span>
  )}
</h2>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    👤 {ticket.assignedTo?.email || 'Unassigned'}
                  </p>
                </div>

                {openTicketId === ticket._id && (
                  <div className="mt-3 text-sm text-gray-700 dark:text-gray-300 space-y-2">
                    <p>{ticket.description}</p>

                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      📤 Created by: {ticket.createdBy?.email}<br />
                      🕓 Created: {new Date(ticket.createdAt).toLocaleString()}<br />
                      🔄 Updated: {new Date(ticket.updatedAt).toLocaleString()}
                    </div>

                    <div className="flex gap-2 mt-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleComplete(ticket._id, ticket.status);
                        }}
                        className="text-xs px-3 py-1 rounded bg-blue-600 text-white hover:bg-blue-700"
                      >
                        {ticket.status === 'completed' ? '↩️ Uncomplete' : '✅ Complete'}
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          editTicket(ticket);
                        }}
                        className="text-xs px-3 py-1 rounded bg-yellow-500 text-white hover:bg-yellow-600"
                      >
                        ✏️ Edit
                      </button>
                      {(role === 'admin' || role === 'support') && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteTicket(ticket._id);
                          }}
                          className="text-xs px-3 py-1 rounded bg-red-600 text-white hover:bg-red-700"
                        >
                          🗑️ Delete
                        </button>
                      )}
                    </div>

                    {ticket.comments?.length > 0 && (
                      <div className="mt-2 border-t pt-2">
                        <h3 className="text-xs font-semibold mb-1">💬 Comments</h3>
                        {ticket.comments.map((comment) => (
                          <div key={comment._id} className="mb-1">
                            <strong>{comment.author?.name || 'Unknown'}:</strong> {comment.message}
                            <div className="text-xs text-gray-400">
                              {new Date(comment.createdAt).toLocaleString()}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {editingTicket && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg w-full max-w-md space-y-4">
              <h2 className="text-xl font-semibold">✏️ Edit Ticket</h2>
              <input
                type="text"
                className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
              />
              <textarea
                rows={4}
                className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
              />
              <input
                type="email"
                placeholder="Assign to (email)"
                className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
                value={editAssignedEmail}
                onChange={(e) => setEditAssignedEmail(e.target.value)}
              />
              <div className="flex justify-end gap-3 pt-2">
                <button
                  onClick={() => setEditingTicket(null)}
                  className="text-gray-500 hover:text-red-500"
                >
                  Cancel
                </button>
                <button
                  onClick={handleEditSubmit}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        )}

        {currentUser && <ChatBox user={currentUser} />}
      </main>
    </div>
  );
}
export default TicketsPage;
