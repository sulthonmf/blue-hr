/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', '"Outfit"', 'sans-serif'],
        display: ['"Outfit"', '"Plus Jakarta Sans"', 'sans-serif']
      },
      colors: {
        actionBlue: '#4D96FF',
        actionGreen: '#6BCB77',
        actionYellow: '#FFD93D',
        actionRed: '#FF6B6B',
        brand: {
          50: '#eef6ff',
          100: '#d9eafe',
          200: '#bccdfd',
          300: '#93aafd',
          400: '#4D96FF',
          500: '#2563eb',
          600: '#1d4ed8',
          700: '#1e40af',
          800: '#1e3a8a',
          900: '#172554',
          950: '#090d16'
        }
      }
    }
  },
  plugins: []
};
