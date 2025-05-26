module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#FFC0CB', // Light pink
        'primary-dark': '#E6ADB7', // Slightly darker pink for hover
        secondary: '#FFFFFF', // White
      },
      fontFamily: {
        'cursive': ['"Dancing Script"', 'cursive'],
      },
    },
  },
  plugins: [],
}