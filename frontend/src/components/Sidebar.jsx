import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaHome, FaComments, FaTicketAlt, FaUsers } from 'react-icons/fa';

const Sidebar = ({ role, setUser }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    navigate('/');
  };

  return (
    <aside className="w-64 bg-[#1e1f22] text-white h-screen flex flex-col shadow-md">
      <div className="p-5 text-2xl font-bold border-b border-[#2c2d30]">
        <span className="text-white">Lean</span>
        <span className="text-purple-400">Flow</span>
      </div>

      <nav className="flex-1 p-4 space-y-2 text-sm">
        <Link
          to="/dashboard"
          className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-[#3a3b3e] transition"
        >
          <FaHome /> Dashboard
        </Link>

        {(role === 'admin' || role === 'support' || role === 'client') && (
          <Link
            to="/chats"
            className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-[#3a3b3e] transition"
          >
            <FaComments /> Chats
          </Link>
        )}

        <Link
          to="/tickets"
          className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-[#3a3b3e] transition"
        >
          <FaTicketAlt /> Tickets
        </Link>

        {role === 'admin' && (
          <Link
            to="/teams"
            className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-[#3a3b3e] transition"
          >
            <FaUsers /> Support Teams
          </Link>
        )}

        {(role === 'admin' || role === 'support') && (
          <Link
            to="/admin"
            className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-[#3a3b3e] transition"
          >
            🛠️ Admin Panel
          </Link>
        )}
      </nav>

      <div className="p-4 border-t border-[#2c2d30] text-sm">
        <button
          onClick={handleLogout}
          className="hover:text-red-400 transition"
        >
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
