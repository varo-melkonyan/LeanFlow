import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'client',
  });

  const navigate = useNavigate();
  const apiBase = 'https://leanflow.onrender.com';
  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await await fetch(`${apiBase}/api/auth/register`, form);
      navigate('/');
    } catch (err) {
      alert('Registration failed: ' + (err.response?.data?.error || 'Unknown error'));
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100 dark:bg-gray-900">
      <form onSubmit={handleRegister} className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow w-80 space-y-4">
        <h2 className="text-xl font-semibold text-center dark:text-white">Register</h2>

        <input
          name="name"
          placeholder="Name"
          className="w-full p-2 border rounded dark:bg-gray-900 dark:text-white"
          onChange={handleChange}
          required
        />
        <input
          name="email"
          placeholder="Email"
          type="email"
          className="w-full p-2 border rounded dark:bg-gray-900 dark:text-white"
          onChange={handleChange}
          required
        />
        <input
          name="password"
          placeholder="Password"
          type="password"
          className="w-full p-2 border rounded dark:bg-gray-900 dark:text-white"
          onChange={handleChange}
          required
        />

        <select
          name="role"
          className="w-full p-2 border rounded dark:bg-gray-900 dark:text-white"
          onChange={handleChange}
        >
          <option value="client">Client</option>
          <option value="support">Support</option>
          <option value="admin">Admin</option>
        </select>
        <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded">
          Register
        </button>

        <p className="text-sm text-center text-gray-600 dark:text-gray-400">
          Already have an account? <a href="/" className="text-blue-400 underline">Login</a>
        </p>
      </form>
    </div>
  );
};

export default Register;
