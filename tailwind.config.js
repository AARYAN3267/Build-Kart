/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          950: '#0A1929',
          900: '#102A43', // Primary Deep Navy
          800: '#1E3A5F',
          700: '#2D4D77',
          600: '#3E6389',
          100: '#E2E8F0',
          50: '#F0F4F8',
        },
        primary: {
          DEFAULT: '#102A43',
          dark: '#0A1929',
          light: '#1E3A5F',
        },
        royal: {
          50: '#EFF6FF',
          100: '#DBEAFE',
          500: '#3B82F6',
          600: '#2563EB', // Secondary Royal Blue
          700: '#1D4ED8',
        },
        emerald: {
          50: '#ECFDF5',
          500: '#10B981',
          600: '#16A34A', // Accent Emerald Green
          700: '#15803D',
        },
        surface: {
          bg: '#F5F7FA', // Background Light Grey
          card: '#FFFFFF',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
