/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        desert: { 50:'#fff8f0', 100:'#ffefd9', 200:'#ffd9a8', 300:'#ffbc6d', 400:'#f59a38', 500:'#e07b1a', 600:'#c45e0f', 700:'#a0450f', 800:'#833714', 900:'#6b2c13' },
        sahara: { 400:'#D4A853', 500:'#C49340', 600:'#A87A2E' },
        night:  { 900:'#0D0A00', 800:'#1A1200', 700:'#2A1E00', 600:'#3D2E00' },
        mauritanie: { green:'#006600', yellow:'#FFD700', red:'#CC0000' }
      },
      fontFamily: {
        display: ['"Playfair Display"', 'serif'],
        body: ['"DM Sans"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace']
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease forwards',
        'slide-up': 'slideUp 0.4s ease forwards',
        'pulse-gold': 'pulseGold 2s infinite',
        'spin-slow': 'spin 3s linear infinite'
      },
      keyframes: {
        fadeIn: { from: { opacity: 0 }, to: { opacity: 1 } },
        slideUp: { from: { transform: 'translateY(20px)', opacity: 0 }, to: { transform: 'translateY(0)', opacity: 1 } },
        pulseGold: { '0%,100%': { boxShadow: '0 0 0 0 rgba(212,168,83,0.4)' }, '50%': { boxShadow: '0 0 0 10px rgba(212,168,83,0)' } }
      }
    }
  },
  plugins: []
}
