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
          DEFAULT: '#ffffff',
          light: '#fafafa',
        },
        secondary: {
          DEFAULT: '#f4f6f8',
          dark: '#e9ecef',
          light: '#f8fafc',
        },
        accent: {
          DEFAULT: '#0284c7', // Soft Corporate Blue
          dark: '#0369a1',
          light: '#e0f2fe',
        },
        gold: {
          DEFAULT: '#c5a880', // Premium Light Gold
          dark: '#b3925c',
          light: '#f5f0e6',
        },
        dark: {
          DEFAULT: '#1e293b', // Slate 800
          light: '#334155', // Slate 700
          muted: '#64748b', // Slate 500
        }
      },
      fontFamily: {
        serif: ['Playfair Display', 'Georgia', 'serif'],
        sans: ['Inter', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        premium: '0 4px 20px -2px rgba(197, 168, 128, 0.1), 0 2px 10px -1px rgba(0, 0, 0, 0.04)',
        soft: '0 4px 6px -1px rgb(0 0 0 / 0.05), 0 2px 4px -2px rgb(0 0 0 / 0.05)',
        card: '0 10px 30px -5px rgba(0, 0, 0, 0.03), 0 1px 3px 0 rgba(0, 0, 0, 0.02)',
      }
    },
  },
  plugins: [],
}
