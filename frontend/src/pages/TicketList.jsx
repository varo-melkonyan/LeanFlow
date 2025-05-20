const TicketList = ({ role }) => {
  // Fetch tickets...
  return (
    <div className="bg-white p-4 rounded-xl shadow">
      <h2 className="text-lg font-semibold mb-2">Tickets</h2>
      {role === 'client' && <p>You can only see your own tickets.</p>}
      {role === 'support' && <p>You can only see assigned tickets.</p>}
      {role === 'admin' && <p>You can see all tickets.</p>}
      {/* show list... */}
    </div>
  );
};
