/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          900: '#20364D',
          700: '#3A526B',
          500: '#64798A',
          400: '#8DA0B0',
          300: '#AEBEC9',
        },
        surface: {
          base: '#F6F9FC',
          alt: '#EEF6FB',
          card: '#FFFFFF',
        },
        brand: {
          50: '#EAF3FB',
          100: '#D2E6F7',
          200: '#A6CDEF',
          300: '#7AB5E5',
          400: '#55B9E6',
          500: '#1976B9',
          600: '#1565A0',
          700: '#105488',
        },
        teal: {
          50: '#E6F7F6',
          100: '#C7EDEB',
          200: '#90DBD8',
          300: '#5BC9C4',
          400: '#20A39E',
          500: '#1B8B87',
          600: '#16736F',
        },
        risk: {
          low: '#22A06B',
          lowBg: '#E6F7EF',
          med: '#EAB308',
          medBg: '#FEF6D9',
          high: '#F97316',
          highBg: '#FFEFDD',
          crit: '#DC2626',
          critBg: '#FCE8E8',
        },
        line: '#DCE8F0',
      },
      fontFamily: {
        sans: ['Inter', 'Manrope', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 2px rgba(16, 84, 136, 0.04), 0 4px 16px rgba(16, 84, 136, 0.06)',
        cardHover: '0 2px 4px rgba(16, 84, 136, 0.06), 0 12px 32px rgba(16, 84, 136, 0.10)',
        float: '0 8px 30px rgba(16, 84, 136, 0.12)',
      },
      borderRadius: {
        xl: '14px',
        '2xl': '18px',
      },
      animation: {
        'pulse-ring': 'pulseRing 2s cubic-bezier(0.4,0,0.6,1) infinite',
        'pulse-soft': 'pulseSoft 2.5s ease-in-out infinite',
        'fade-up': 'fadeUp 0.5s ease-out',
        'fade-in': 'fadeIn 0.4s ease-out',
        'slide-in-right': 'slideInRight 0.35s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'count': 'count 0.8s ease-out',
        'shimmer': 'shimmer 2s linear infinite',
        'route-dash': 'routeDash 1.5s linear infinite',
        'breathe': 'breathe 3s ease-in-out infinite',
      },
      keyframes: {
        pulseRing: {
          '0%': { transform: 'scale(0.8)', opacity: '0.8' },
          '100%': { transform: 'scale(2.2)', opacity: '0' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px) scale(0.98)' },
          '100%': { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
        count: {
          '0%': { opacity: '0', transform: 'scale(0.92)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        routeDash: {
          '0%': { strokeDashoffset: '40' },
          '100%': { strokeDashoffset: '0' },
        },
        breathe: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.04)' },
        },
      },
    },
  },
  plugins: [],
};
