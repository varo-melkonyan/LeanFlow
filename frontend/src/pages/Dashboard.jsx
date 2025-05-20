import React, { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import ChatBox from '../components/ChatBox';
import TicketList from '../components/TicketList';
import DarkModeToggle from '../components/DarkModeToggle';
import LanguageSwitcher from '../components/LanguageSwitcher';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';

const socket = io('https://leanflow.onrender.com');

const Dashboard = ({ role, setUser }) => {
  const [userName, setUserName] = useState('');
  const navigate = useNavigate();


useEffect(() => {
  const user = JSON.parse(localStorage.getItem('user'));
  if (!user?.email) return;

  if (user?.name) setUserName(user.name);

  socket.emit('userOnline', user.email);
  socket.emit('registerUser', user.email);

  const handleForceLogout = () => {
    alert('Your access role has been changed. You will be logged out.');
    localStorage.removeItem('user');
    navigate('/login');
  };

  socket.on('forceLogout', handleForceLogout);

  return () => {
    socket.off('forceLogout', handleForceLogout);
  };
}, [navigate]);



  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white">
      <Sidebar role={role} setUser={setUser} />

      <main className="flex-1 p-6 overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">Welcome, {userName || role}</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Here’s your dashboard overview.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <LanguageSwitcher />
            <DarkModeToggle />
            <img
              src="https://i.pravatar.cc/40"
              alt="avatar"
              className="w-8 h-8 rounded-full border"
            />
          </div>
        </div>

        {/* Overview Cards */}
        {role === 'admin' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <Card title="Open" count={3} color="blue" />
            <Card title="In Progress" count={5} color="yellow" />
            <Card title="Closed" count={12} color="green" />
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {(role === 'admin' || role === 'support') && <ChatBox />}
          <TicketList role={role} />
        </div>
      </main>
    </div>
  );
};

const Card = ({ title, count, color }) => {
  const colorClasses = {
    blue: 'text-blue-600',
    yellow: 'text-yellow-500',
    green: 'text-green-500',
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm">
      <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
      <p className={`text-2xl font-bold ${colorClasses[color]}`}>{count}</p>
    </div>
  );
};

export default Dashboard;
