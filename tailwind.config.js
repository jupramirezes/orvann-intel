/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        orvann: {
          black: "#0a0a0a",
          white: "#f5f5f5",
          gray: "#262626",
          accent: "#ffffff",
          soft: "#404040",
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif', 'system-ui'],
      },
      backgroundImage: {
        'glass': 'linear-gradient(135deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.01))',
      },
    },
  },
  plugins: [],
}
