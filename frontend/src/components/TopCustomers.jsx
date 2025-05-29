// TopCustomers.jsx
import React from 'react';

const TopCustomers = ({ customers = [] }) => {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm mb-6">
      <h2 className="text-lg font-bold mb-4">Customers with Most Tickets</h2>
      <ul className="divide-y divide-gray-200 dark:divide-gray-700">
        {customers.map((customer, index) => (
          <li key={index} className="flex items-center justify-between py-2">
            <div className="flex items-center gap-3">
              <img
                src={`https://i.pravatar.cc/150?img=${index + 10}`}
                alt={customer.name}
                className="w-10 h-10 rounded-full border"
              />
              <span className="font-medium">{customer.name}</span>
            </div>
            <span className="text-sm text-gray-500 dark:text-gray-400">{customer.ticketCount} tickets</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TopCustomers;
