/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        serif: ['Playfair Display', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        primary: {
          DEFAULT: "#1f2937",
          light: "#4b5563",
        },
        accent: "#0ea5e9",
        silver: {
          300: '#C0C0C0',
          400: '#A8A8A8',
          500: '#909090',
          600: '#787878',
        },
      },
    },
  },
  plugins: [],
};
