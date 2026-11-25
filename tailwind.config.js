/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        nexus: {
          amber: '#FFAC2F',
          deep: '#E99519',
          black: '#050505',
          charcoal: '#151515',
          surface: '#1D1D1D',
          border: '#262626',
          'border-light': '#333333',
          warm: '#FAFAF8',
          white: '#FFFFFF',
          muted: '#888888',
          subtle: '#A0A0A0',
        }
      },
      fontFamily: {
        heading: ['"Space Grotesk"', 'sans-serif'],
        sans: ['Inter', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      boxShadow: {
        'amber-glow': '0 0 25px -5px rgba(255, 172, 47, 0.25)',
        'amber-glow-lg': '0 0 45px -8px rgba(255, 172, 47, 0.35)',
        'card': '0 8px 30px rgba(0, 0, 0, 0.6), 0 0 1px 1px rgba(255, 255, 255, 0.05)',
      }
    },
  },
  plugins: [],
}

