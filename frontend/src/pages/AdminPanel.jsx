import React, { useEffect, useState } from 'react';
import axios from 'axios';

const colorNameToHex = (color) => {
  const map = {
    red: '#ff0000',
    green: '#00ff00',
    blue: '#0000ff',
    black: '#000000',
    gray: '#808080',
    yellow: '#ffff00',
    orange: '#ffa500',
    purple: '#800080',
    pink: '#ffc0cb',
    white: '#ffffff'
  };
  if (!color || color === '') return '#808080';
  if (color.startsWith('#')) return color;
  return map[color.toLowerCase()] || '#000000';
};

const roles = ['admin', 'support', 'client'];

const AdminPanel = () => {
  const [editingUserId, setEditingUserId] = useState(null);
  const [editedUser, setEditedUser] = useState({ name: '', email: '' });
  const [users, setUsers] = useState([]);
  const currentUser = JSON.parse(localStorage.getItem('user')) || {};
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    password: '',
    role: 'client',
  });
  const apiBase = 'https://leanflow.onrender.com';
  
  useEffect(() => {
    axios.get('https://leanflow.onrender.com/api/users')
      .then(res => {
        setUsers(res.data);
      })
      .catch(err => console.error(err));
  }, []);

  const handleRoleChange = async (userId, newRole) => {
    try {
      const res = await axios.put(`https://leanflow.onrender.com/api/users/${userId}/role`, { role: newRole });
      setUsers(prevUsers =>
        prevUsers.map(user =>
          user._id === userId ? { ...user, role: res.data.role } : user
        )
      );
    } catch (err) {
      console.error('Error updating role:', err);
    }
  };

  const handleColorChange = async (userId, color) => {
    try {
      await axios.put(`https://leanflow.onrender.com/api/users/${userId}/color`, { color });
      setUsers(prev =>
        prev.map(u => (u._id === userId ? { ...u, chatColor: color } : u))
      );
    } catch (err) {
      console.error('Error updating color:', err);
    }
  };

  const handleAddUser = async () => {
    try {
      if (currentUser.role === 'support' && newUser.role !== 'client') {
        alert('Support can only create clients.');
        return;
      }

      await await fetch(`${apiBase}/api/users/create`, newUser, {
        headers: { 'x-user-email': currentUser.email }
      });

      alert('✅ User created successfully');
      setNewUser({ name: '', email: '', password: '', role: 'client' });

      const res = await axios.get('https://leanflow.onrender.com/api/users');
      setUsers(res.data);
    } catch (err) {
      console.error('User create error:', err);
      alert(err.response?.data?.error || 'Failed to create user');
    }
  };
const handleDeleteUser = async (userId) => {
  try {
    await axios.delete(`https://leanflow.onrender.com/api/users/${userId}`, {
      headers: {
        'x-user-email': currentUser.email
      }
    });

    setUsers(prev => prev.filter(u => u._id !== userId));
    alert('✅ User deleted');
  } catch (err) {
    alert(err.response?.data?.error || 'Failed to delete user');
    console.error('Delete error:', err);
  }
};
const handleSaveUser = async (userId) => {
  try {
    await axios.put(`https://leanflow.onrender.com/api/users/${userId}`, editedUser);
    setUsers(prev => prev.map(u =>
      u._id === userId ? { ...u, ...editedUser } : u
    ));
    setEditingUserId(null);
  } catch (err) {
    alert('❌ Failed to save user');
    console.error('Save error:', err);
  }
};

return (
  <div className="p-6">
    <h2 className="text-2xl font-bold mb-6">Admin Panel</h2>

    {(currentUser.role === 'admin' || currentUser.role === 'support') && (
      <div className="mb-6 p-4 bg-white dark:bg-gray-800 rounded-xl shadow">
        <h3 className="text-lg font-bold mb-2">Add New User</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Name"
            value={newUser.name}
            onChange={e => setNewUser({ ...newUser, name: e.target.value })}
            className="border p-2 rounded"
          />
          <input
            type="email"
            placeholder="Email"
            value={newUser.email}
            onChange={e => setNewUser({ ...newUser, email: e.target.value })}
            className="border p-2 rounded"
          />
          <input
            type="password"
            placeholder="Password"
            value={newUser.password}
            onChange={e => setNewUser({ ...newUser, password: e.target.value })}
            className="border p-2 rounded"
          />
          <select
            value={newUser.role}
            onChange={e => setNewUser({ ...newUser, role: e.target.value })}
            className="border p-2 rounded"
          >
            <option value="client">client</option>
            {currentUser.role === 'admin' && <option value="support">support</option>}
          </select>
        </div>
        <button
          onClick={handleAddUser}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
        >
          ➕ Add User
        </button>
      </div>
    )}

    <table className="w-full border">
      <thead>
        <tr className="bg-gray-200">
          <th className="p-2 border">Online</th>
          <th className="p-2 border">Status</th>
          <th className="p-2 border">Name</th>
          <th className="p-2 border">Email</th>
          <th className="p-2 border">Role</th>
          <th className="p-2 border">Chat Color</th>
          <th className="p-2 border">Actions</th>
        </tr>
      </thead>
      <tbody>
        {users.map(user => (
          <tr key={user._id} className="border-t">
            <td className="p-2 border text-center">
              <span
                className={`inline-block w-3 h-3 rounded-full ${
                  user.isOnline ? 'bg-green-500' : 'bg-red-500'
                }`}
                title={user.isOnline ? 'Online' : 'Offline'}
              ></span>
            </td>
            <td className="p-2 border text-center">
              {user.isActive ? (
                <span className="text-green-600 font-semibold">Active</span>
              ) : (
                <span className="text-gray-500">Inactive</span>
              )}
            </td>
            <td className="p-2 border">
              {editingUserId === user._id ? (
                <input
                  type="text"
                  value={editedUser.name}
                  onChange={e => setEditedUser({ ...editedUser, name: e.target.value })}
                  className="border p-1 w-full"
                />
              ) : (
                user.name
              )}
            </td>
            <td className="p-2 border">
              {editingUserId === user._id ? (
                <input
                  type="email"
                  value={editedUser.email}
                  onChange={e => setEditedUser({ ...editedUser, email: e.target.value })}
                  className="border p-1 w-full"
                />
              ) : (
                user.email
              )}
            </td>
            <td className="p-2 border">
              {(currentUser.role === 'admin' || currentUser.role === 'support') ? (
                <select
                  value={user.role}
                  onChange={e => handleRoleChange(user._id, e.target.value)}
                  className="border p-1 rounded"
                >
                  {roles.map(role => (
                    <option key={role} value={role}>{role}</option>
                  ))}
                </select>
              ) : (
                <span>{user.role}</span>
              )}
            </td>
            <td className="p-2 border flex items-center gap-2">
              <span
                className="w-5 h-5 rounded-full border"
                style={{ backgroundColor: colorNameToHex(user.chatColor) }}
              ></span>
              {(currentUser.role === 'admin' || currentUser.role === 'support') ? (
                <input
                  type="color"
                  value={colorNameToHex(user.chatColor)}
                  onChange={e => handleColorChange(user._id, e.target.value)}
                  className="w-10 h-6 p-0 border"
                />
              ) : (
                <div
                  className="w-10 h-6 rounded border"
                  style={{ backgroundColor: colorNameToHex(user.chatColor) }}
                  title={user.chatColor}
                ></div>
              )}
            </td>
            <td className="p-2 border">
              {editingUserId === user._id ? (
                <>
                  <button
                    className="text-green-600 hover:underline"
                    onClick={() => handleSaveUser(user._id)}
                  >
                    💾 Save
                  </button>
                  <button
                    className="text-gray-500 hover:underline"
                    onClick={() => setEditingUserId(null)}
                  >
                    ❌ Cancel
                  </button>
                </>
              ) : (
                <>
                  <button
                    className="text-blue-600 hover:underline"
                    onClick={() => {
                      setEditingUserId(user._id);
                      setEditedUser({ name: user.name, email: user.email });
                    }}
                  >
                    📝 Edit
                  </button>
                  {(currentUser.role === 'admin' || currentUser.role === 'support') &&
                   user.role !== 'admin' &&
                   !(user.role === 'support' && currentUser.role !== 'admin') && (
                    <button
                      className="text-red-600 hover:underline"
                      onClick={() => handleDeleteUser(user._id)}
                    >
                      🗑️ Delete
                    </button>
                  )}
                </>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);
};

export default AdminPanel;
