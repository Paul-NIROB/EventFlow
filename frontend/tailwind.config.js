/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          DEFAULT: '#0b0f1a',
          lighter: '#161d2e',
          card: 'rgba(255, 255, 255, 0.05)',
        },
        accent: {
          DEFAULT: '#6c63ff',
          hover: '#5a52e6',
        },
        text: {
          DEFAULT: '#f0f4ff',
          muted: '#94a3b8',
        }
      },
      fontFamily: {
        heading: ['Sora', 'sans-serif'],
        body: ['DM Sans', 'sans-serif'],
      },
      backdropBlur: {
        xs: '2px',
      }
    },
  },
  plugins: [],
}
