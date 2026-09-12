/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1E3A5F',
        accent: '#F5A623',
        success: '#10B981',
        danger: '#EF4444',
        background: '#F8FAFC',
        card: '#FFFFFF',
      }
    },
  },
  plugins: [],
}