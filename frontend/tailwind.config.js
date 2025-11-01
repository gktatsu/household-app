/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9f4',
          100: '#daf1e4',
          200: '#b8e3cc',
          300: '#88ceac',
          400: '#5ab18a',
          500: '#3d9770',
          600: '#2d7a5a',
          700: '#25614a',
          800: '#204e3d',
          900: '#1c4133',
        },
        income: {
          light: '#b8dae3',
          DEFAULT: '#6fb0c2',
          dark: '#4a8599',
        },
        expense: {
          light: '#f5d4ba',
          DEFAULT: '#e8a76f',
          dark: '#c78a55',
        },
      },
    },
  },
  plugins: [],
}