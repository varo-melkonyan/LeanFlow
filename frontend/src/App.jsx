import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import './i18n';
import TicketsPage from './pages/TicketsPage';
import ChatBox from './components/ChatBox';
import AdminPanel from './pages/AdminPanel';
import ActivationPage from './pages/ActivationPage';
import Chats from './pages/Chats';


const App = () => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={user ? <Navigate to="/dashboard" /> : <Login setUser={setUser} />}
        />
        <Route path="/register" element={<Register />} />
        <Route
          path="/dashboard"
          element={user ? (
            <Dashboard role={user.role} setUser={setUser} />
          ) : (
            <Navigate to="/" />
          )}
        />
        <Route
          path="/tickets"
          element={user ? (
            <TicketsPage role={user.role} setUser={setUser} />
          ) : (
            <Navigate to="/" />
          )}
        />
        <Route
  path="/admin"
  element={(user?.role === 'admin' || user?.role === 'support') ? (
    <AdminPanel />
  ) : (
    <Navigate to="/" />
  )}
/>
<Route path="/activate/:token" element={<ActivationPage />} />
<Route
  path="/chats"
  element={user ? (
    <Chats />
  ) : (
    <Navigate to="/" />
  )}
/>
      </Routes>

      {/* ✅ Live Chat global visibility */}
      {user && <ChatBox user={user} />}
    </Router>
  );
};

export default App;
