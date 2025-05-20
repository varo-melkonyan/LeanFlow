import React, { useEffect, useState } from 'react';
import axios from 'axios';

const TicketList = ({ role }) => {
  const [tickets, setTickets] = useState([]);

  const fetchTickets = async () => {
    const res = await axios.get('https://leanflow.onrender.com/api/tickets');
    const user = JSON.parse(localStorage.getItem('user'));

    let filtered = res.data;

    if (role === 'client') {
      filtered = res.data.filter(t => t.createdBy?._id === user.id);
    }

    if (role === 'support') {
      filtered = res.data.filter(t => t.assignedTo?._id === user.id);
    }

    setTickets(filtered);
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow h-[400px] overflow-y-auto">
      <h2 className="text-lg font-semibold mb-4">Tickets</h2>

      {tickets.length === 0 ? (
        <p className="text-sm text-gray-500 dark:text-gray-400">No tickets available.</p>
      ) : (
        <ul className="space-y-3">
          {tickets.map((ticket) => (
            <li key={ticket._id} className="p-3 border rounded bg-gray-50 dark:bg-gray-700">
              <p className="font-semibold">{ticket.title}</p>
              <p className="text-sm text-gray-600 dark:text-gray-300">{ticket.status}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TicketList;
