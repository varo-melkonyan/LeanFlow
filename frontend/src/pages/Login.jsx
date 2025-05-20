import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = ({ setUser }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const apiBase = "https://leanflow.onrender.com";

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${apiBase}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Login failed');

      const fullUser = {
        id: data.id || data._id,
        name: data.name,
        role: data.role,
        email: data.email
      };

      localStorage.setItem('user', JSON.stringify(fullUser));
      setUser(data);
      navigate('/dashboard');
    } catch (err) {
      console.error('🔥 Login error:', err.message);
      alert('Login failed: ' + err.message);
    }
  };

  const handleResendActivation = async () => {
    if (!email) return alert('Please enter your email first.');

    try {
      const res = await fetch(`${apiBase}/api/auth/resend-activation`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email })
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Failed');

      alert('✅ ' + data.message);
    } catch (err) {
      alert('❌ ' + err.message);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100 dark:bg-gray-900">
      <form
        onSubmit={handleLogin}
        className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow w-80 space-y-4"
      >
        <h2 className="text-xl font-semibold text-center dark:text-white">Login</h2>
        <input
          type="email"
          placeholder="Email"
          className="w-full p-2 border rounded dark:bg-gray-900 dark:text-white"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full p-2 border rounded dark:bg-gray-900 dark:text-white"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded"
        >
          Login
        </button>
        <button
          type="button"
          onClick={handleResendActivation}
          className="text-sm text-blue-600 hover:underline mt-2"
        >
          🔁 Resend Activation Email
        </button>
      </form>
    </div>
  );
};

export default Login;
