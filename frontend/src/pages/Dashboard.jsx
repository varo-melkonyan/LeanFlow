import React, { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import ChatBox from '../components/ChatBox';
import TicketList from '../components/TicketList';
import DarkModeToggle from '../components/DarkModeToggle';
import LanguageSwitcher from '../components/LanguageSwitcher';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import TicketChart from '../components/TicketChart';
import TopCustomers from '../components/TopCustomers';
import LatestTickets from '../components/LatestTickets';



const socket = io('https://leanflow.onrender.com');
const apiBase = 'https://leanflow.onrender.com';

const Dashboard = ({ role, setUser }) => {
  const [userName, setUserName] = useState('');
  const [ticketStats, setTicketStats] = useState({ open: 0, in_progress: 0, completed: 0 });
  const navigate = useNavigate();
  const topCustomers = [
  { name: 'Alice Johnson', ticketCount: 25 },
  { name: 'Michael Smith', ticketCount: 18 },
  { name: 'Lisa Carter', ticketCount: 13 },
];
const [recentTickets, setRecentTickets] = useState([]);
const [chartData, setChartData] = useState([]);

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

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
  try {
    const user = JSON.parse(localStorage.getItem('user'));
    const res = await axios.get(`${apiBase}/api/tickets`);
    const all = res.data;

    let filtered = all;

    if (user.role === 'client') {
      filtered = all.filter(
        (t) => t.createdBy?._id === user.id || t.assignedTo?._id === user.id
      );
    }

    const stats = {
      open: filtered.filter(t => t.status === 'open').length,
      in_progress: filtered.filter(t => t.status === 'in_progress').length,
      completed: filtered.filter(t => t.status === 'completed').length
    };

    setTicketStats(stats);
    setRecentTickets(filtered.slice(0, 5));

    // 📊 completed tickets by month
    const monthsData = Array(12).fill(0);

    filtered.forEach((ticket) => {
      if (ticket.status === 'completed' && ticket.createdAt) {
        const date = new Date(ticket.createdAt);
        const month = date.getMonth(); // 0–11
        monthsData[month]++;
      }
    });

    const monthLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    const monthlyCompleted = monthLabels.map((month, i) => ({
      month,
      Solved: monthsData[i],
    }));

    setChartData(monthlyCompleted);

  } catch (err) {
    console.error('❌ Failed to fetch stats:', err);
  }
};

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

        {/* Dynamic Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
  <Card title="Total" count={ticketStats.open + ticketStats.in_progress + ticketStats.completed} color="yellow" />
  <Card title="Open" count={ticketStats.open} color="blue" />
  <Card title="In Progress" count={ticketStats.in_progress} color="yellow" />
  <Card title="Completed" count={ticketStats.completed} color="green" />
</div>
<TicketChart data={chartData} />
<TopCustomers customers={topCustomers} />
<LatestTickets tickets={recentTickets} />
<div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm mb-6">
  <h2 className="text-lg font-bold mb-2">Estimated of Solved Tickets</h2>
  <div className="h-48 flex items-center justify-center text-gray-400 dark:text-gray-600">
  </div>
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
