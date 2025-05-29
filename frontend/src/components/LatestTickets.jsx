// LatestTickets.jsx
import React from 'react';
const getPriorityColor = (priority) => {
  switch ((priority || '').toLowerCase()) {
    case 'high':
      return 'bg-red-100 text-red-700';
    case 'medium':
      return 'bg-yellow-100 text-yellow-800';
    case 'low':
      return 'bg-green-100 text-green-700';
    default:
      return 'bg-gray-100 text-gray-600';
  }
};

const LatestTickets = ({ tickets = [] }) => {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm mb-6 overflow-x-auto">
      <h2 className="text-lg font-bold mb-4">Latest Tickets</h2>
      <table className="min-w-full text-sm text-left">
        <thead>
          <tr className="text-gray-600 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700">
            <th className="py-2 px-4">ID</th>
            <th className="py-2 px-4">Requester</th>
            <th className="py-2 px-4">Subject</th>
            <th className="py-2 px-4">Status</th>
            <th className="py-2 px-4">Priority</th>
            <th className="py-2 px-4">Assignee</th>
            <th className="py-2 px-4">Date</th>
          </tr>
        </thead>
        <tbody>
          {tickets.map((t, i) => (
            <tr key={i} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
              <td className="py-2 px-4">{t._id.slice(-6)}</td>
              <td className="py-2 px-4">{t.createdBy?.name || '-'}</td>
              <td className="py-2 px-4">{t.subject}</td>
              <td className="py-2 px-4 capitalize">{t.status}</td>
              <td className="py-2 px-4">
  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(t.priority)}`}>
    {t.priority || 'N/A'}
  </span>
</td>
              <td className="py-2 px-4">{t.assignedTo?.name || '-'}</td>
              <td className="py-2 px-4">{new Date(t.createdAt).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LatestTickets;
