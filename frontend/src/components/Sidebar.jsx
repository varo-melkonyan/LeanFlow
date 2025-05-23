// components/Sidebar.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaHome, FaComments, FaTicketAlt, FaUsers } from 'react-icons/fa';

const Sidebar = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));
  const role = user?.role;

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/');
    window.location.reload();
  };

  return (
    <aside className="w-64 h-full bg-[#1e1f22] text-white flex flex-col border-r border-[#2c2d30]">
      {/* Logo */}
      <div className="h-14 flex items-center px-4 text-xl font-bold border-b border-[#2c2d30]">
        <span className="text-white">Lean</span>
        <span className="text-purple-400">Flow</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-4 py-6 text-sm space-y-1">
        <Link
          to="/dashboard"
          className="block px-3 py-2 rounded hover:bg-[#3a3b40] transition flex items-center gap-2"
        >
          <FaHome /> Dashboard
        </Link>

        <Link
          to="/chats"
          className="block px-3 py-2 rounded hover:bg-[#3a3b40] transition flex items-center gap-2"
        >
          <FaComments /> Chats
        </Link>

        <Link
          to="/tickets"
          className="block px-3 py-2 rounded hover:bg-[#3a3b40] transition flex items-center gap-2"
        >
          <FaTicketAlt /> Tickets
        </Link>

        {role === 'admin' && (
          <Link
            to="/teams"
            className="block px-3 py-2 rounded hover:bg-[#3a3b40] transition flex items-center gap-2"
          >
            <FaUsers /> Support Teams
          </Link>
        )}

        {(role === 'admin' || role === 'support') && (
          <Link
            to="/admin"
            className="block px-3 py-2 rounded hover:bg-[#3a3b40] transition flex items-center gap-2"
          >
            🛠️ Admin Panel
          </Link>
        )}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-[#2c2d30] text-sm">
        <div className="text-gray-300 mb-2">{user?.name}</div>
        <button
          onClick={handleLogout}
          className="text-red-400 hover:text-red-300 transition"
        >
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
