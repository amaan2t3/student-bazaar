/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Refined Senior UI Palette
        navy: {
          DEFAULT: '#0F172A',   // Deep slate navy - Primary structure & typography
          dark: '#090D16',      // Midnight base
          mid: '#1E293B',       // Secondary dark surface
          light: '#475569',     // Slate body text
        },
        gold: {
          DEFAULT: '#C89D42',   // Warm brass gold - High contrast accents
          soft: '#F5EFE6',      // Delicate warm tint for badges
          dark: '#A67F2C',      // Active & hover states
          border: '#E8DBC5',    // Subtle warm border
        },
        surface: {
          DEFAULT: '#FFFFFF',
          muted: '#F8FAFC',
          subtle: '#F1F5F9',
          border: '#E2E8F0',
        },
        ivory: {
          DEFAULT: '#FBFBFA',
          dark: '#E7E5E4',
        },
        muted: '#64748B',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        'subtle': '0 1px 2px 0 rgba(15, 23, 42, 0.05)',
        'elevated': '0 4px 6px -1px rgba(15, 23, 42, 0.07), 0 2px 4px -2px rgba(15, 23, 42, 0.05)',
        'card-hover': '0 10px 15px -3px rgba(15, 23, 42, 0.08), 0 4px 6px -4px rgba(15, 23, 42, 0.04)',
      }
    },
  },
  plugins: [],
}
