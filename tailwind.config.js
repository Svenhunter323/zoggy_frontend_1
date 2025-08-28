/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'poppins': ['Poppins', 'sans-serif'],
        'montserrat': ['Montserrat', 'sans-serif'],
        'inter': ['Inter', 'sans-serif'],
      },
      colors: {
        brand: '#591a11',
        gold: '#f0c337',
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
          100: '#0f0f13',
        },
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
        'pulse-slow': 'pulse 3s infinite',
        'bounce-slow': 'bounce 2s infinite',
        'slide-up': 'slideUp 0.5s ease-out',
        'fade-in': 'fadeIn 0.3s ease-in',
        'fade-in-up': 'fadeInUp 0.8s ease-out',
        'spin-slow': 'spin 3s linear infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'flip': 'flip 0.6s ease-in-out',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': { transform: 'translateY(30px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        glow: {
          '0%': { textShadow: '0 0 5px #f0c337, 0 0 10px #f0c337, 0 0 15px #f0c337' },
          '100%': { textShadow: '0 0 10px #f0c337, 0 0 20px #f0c337, 0 0 30px #f0c337' },
        },
        flip: {
          '0%': { transform: 'rotateY(0deg)' },
          '50%': { transform: 'rotateY(180deg)' },
          '100%': { transform: 'rotateY(0deg)' }
        }
      },
      blur: {
        'xs': '1px',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      }
    },
  },
  plugins: [],
}