/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0057B7',
          dark: '#003D80',
        },
        accent: '#FFCC00',
        dark: '#333333',
        medium: '#666666',
        light: '#F7F7F7',
        border: 'rgb(var(--color-medium) / 0.2)',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      fontSize: {
        h1: ['36px', { lineHeight: '1.2', fontWeight: '700' }],
        h2: ['28px', { lineHeight: '1.3', fontWeight: '600' }],
        h3: ['22px', { lineHeight: '1.4', fontWeight: '600' }],
        h4: ['18px', { lineHeight: '1.5', fontWeight: '600' }],
        body: ['16px', { lineHeight: '1.6', fontWeight: '400' }],
        secondary: ['14px', { lineHeight: '1.6', fontWeight: '400' }],
        strong: ['16px', { lineHeight: '1.6', fontWeight: '700' }],
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      keyframes: {
        'accordion-down': {
          from: { height: 0 },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: 0 },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
  plugins: [],
};
