/** @type {import('tailwindcss').Config} */
export default {
  content: ['./app/index.html', './app/src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        graphite: '#111827',
        copper: '#c46a2f',
        steel: '#36536b',
      },
    },
  },
  plugins: [],
};
