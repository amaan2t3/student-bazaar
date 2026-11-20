/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // StudentBazaar Brand Colors
        navy: {
          DEFAULT: '#101827',   // Midnight Navy - Navbar, Footer, Headings
          dark: '#101827',
          mid: '#1B2940',       // Royal Navy - Secondary buttons
          light: '#475569',     // Slate Text
        },
        gold: {
          DEFAULT: '#D6B779',   // Champagne Gold - Primary buttons, icons
          soft: '#E9D9B5',      // Soft Gold
          dark: '#B8933A',      // Darker gold for hover
        },
        ivory: {
          DEFAULT: '#F8F5ED',   // Main background
          dark: '#E5E1D8',      // Border
        },
        muted: '#94A3B8',       // Muted Grey
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
