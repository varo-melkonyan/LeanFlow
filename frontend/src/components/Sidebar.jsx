import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaHome, FaComments, FaTicketAlt, FaUsers } from 'react-icons/fa';

const Sidebar = ({ role, setUser }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null); // ✅ React state թարմացում
    navigate('/');
  };

  return (
    <aside className="w-64 bg-blue-900 text-white h-full flex flex-col">
      <div className="p-6 text-2xl font-bold border-b border-blue-800">
        <span className="text-white">Lean</span>
        <span className="text-blue-300">Flow</span>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        <Link to="/dashboard" className="flex items-center gap-2 hover:text-blue-200">
          <FaHome /> Dashboard
        </Link>

        {(role === 'admin' || role === 'support' || role === 'client') && (
          <Link to="/chats" className="flex items-center gap-2 hover:text-blue-200">
            <FaComments /> Chats
          </Link>
        )}

        <Link to="/tickets" className="flex items-center gap-2 hover:text-blue-200">
          <FaTicketAlt /> Tickets
        </Link>

        {role === 'admin' && (
          <Link to="/teams" className="flex items-center gap-2 hover:text-blue-200">
            <FaUsers /> Support Teams
          </Link>
        )}
        {(role === 'admin' || role === 'support') && (
  <Link
    to="/admin"
    className="flex items-center gap-2 hover:text-blue-200"
  >
    🛠️ Admin Panel
  </Link>
)}
      </nav>

      <div className="p-4 border-t border-blue-800 text-sm">
        <button onClick={handleLogout} className="hover:text-red-300">
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
