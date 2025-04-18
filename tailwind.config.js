/** @type {import('tailwindcss').Config} */
export default {
 content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        flapstick: ['Flapstick', 'cursive'],
        avenir: ['Avenir', 'sans-serif'],
      },
      colors: {
        primary: '#e16f50',
        secondary: '#35727d',
      },
    },
  },
  plugins: [],
}

