module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        'paradise-pink': 'EF476F',
        'orange-yellow': 'FFD166',
        'caribbean-green': '06D6A0',
        'blue-ncs': '118AB2',
        'midnight-green': '073B4C',
      },
      fontFamily: {
        roboto: ['Roboto', 'sans-serif'],
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
