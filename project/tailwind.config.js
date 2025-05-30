/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#00a499', // Pantone 3272C
          50: '#e6f7f5',
          100: '#ccefeb',
          200: '#99dfd6',
          300: '#66cfc2',
          400: '#33bfad',
          500: '#00a499',
          600: '#00837a',
          700: '#00625c',
          800: '#00423d',
          900: '#00211f',
        },
        gray: {
          DEFAULT: '#333F48', // Pantone 432C
          50: '#f5f6f7',
          100: '#ebedef',
          200: '#d7dbdf',
          300: '#c3c9cf',
          400: '#afb7bf',
          500: '#9ba5af',
          600: '#87939f',
          700: '#73818f',
          800: '#333F48',
          900: '#1f262c',
        }
      },
      fontFamily: {
        sans: ['Roboto', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Helvetica Neue', 'Arial', 'sans-serif'],
        mono: ['Roboto Mono', 'monospace'],
      },
    },
  },
  plugins: [],
};