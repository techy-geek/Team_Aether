/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        panel: '#ffffff',
        subtle: '#f8fafc',
        border: '#e2e8f0',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Consolas', 'Courier New', 'monospace'],
      },
      boxShadow: {
        'card': '0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px 0 rgba(0, 0, 0, 0.03)',
        'glow-cyan': '0 0 12px rgba(6, 182, 212, 0.25)',
        'glow-orange': '0 0 12px rgba(249, 115, 22, 0.25)',
        'glow-red': '0 0 12px rgba(239, 68, 68, 0.25)',
      }
    },
  },
  plugins: [],
}
