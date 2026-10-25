/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gunmetal: {
          950: '#0A0C0E',
          900: '#121417',
          850: '#16191E',
          800: '#1C2026',
          700: '#282E37',
          600: '#3D4653',
        },
        silver: {
          DEFAULT: '#C0C0C0',
          light: '#E2E8F0',
          muted: '#94A3B8',
          dark: '#64748B',
        },
        platinum: '#F1F5F9',
        neon: {
          blue: '#00D2FF',
          sky: '#38BDF8',
          amber: '#F59E0B',
          emerald: '#10B981',
          rose: '#F43F5E',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
        display: ['Outfit', 'sans-serif'],
      },
      backgroundImage: {
        'brushed-metallic': 'linear-gradient(135deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.01) 100%)',
        'silver-glow': 'radial-gradient(circle, rgba(192,192,192,0.15) 0%, transparent 70%)',
        'carbon-mesh': 'radial-gradient(#282e37 1px, transparent 1px)',
      },
      animation: {
        'pulse-glow': 'pulseGlow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        pulseGlow: {
          '0%, 100%': { opacity: '1', filter: 'drop-shadow(0 0 12px rgba(0, 210, 255, 0.6))' },
          '50%': { opacity: '0.6', filter: 'drop-shadow(0 0 4px rgba(0, 210, 255, 0.2))' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
    },
  },
  plugins: [],
}
