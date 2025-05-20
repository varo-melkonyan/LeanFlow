/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class', // ✅ կարևոր է dark mode-ի համար
  content: ['./src/**/*.{js,jsx,ts,tsx}'], // որոնում է style-ներ բոլոր ֆայլերում
  theme: {
    extend: {},
  },
  plugins: [],
};
