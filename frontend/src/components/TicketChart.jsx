// TicketChart.jsx
import React from 'react';
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const TicketChart = ({ data }) => {
  if (!data?.length) return null;

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm mb-6">
      <h2 className="text-lg font-bold mb-2">Estimated of Solved Tickets</h2>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="Solved" stroke="#10b981" strokeWidth={3} dot />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};


export default TicketChart;
