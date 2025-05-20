import React, { useEffect, useState } from 'react';

const DarkModeToggle = () => {
  const [dark, setDark] = useState(() => {
    return localStorage.getItem('theme') === 'dark';
  });

  useEffect(() => {
    const root = window.document.documentElement;

    if (dark) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [dark]);

  return (
    <button
      onClick={() => setDark(!dark)}
      className="px-4 py-2 border rounded text-sm dark:bg-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-600 transition"
    >
      {dark ? '🌙 Dark' : '☀️ Light'}
    </button>
  );
};

export default DarkModeToggle;
