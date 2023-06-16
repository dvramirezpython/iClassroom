/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}', './public/*.{html}'
  ],
  theme: {
    extend: {
      colors: {
        'light-blue': '#5EA7EF',
        'dark-blue': '#1B407F',
        'orange': '#FF715B',
        'gray-dark': '#1B1B1B'
      },
      fontFamily: {
        'main': ['Raleway']
      }
    },
  },
  plugins: [
  ],
};