/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eefdf6',
          100: '#d6f9e8',
          200: '#aff1d3',
          300: '#79e4b9',
          400: '#3fce99',
          500: '#16b67e',
          600: '#0a9367',
          700: '#0a7554',
          800: '#0c5d45',
          900: '#0b4c3a',
        },
        ink: {
          DEFAULT: '#0f172a',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 2px rgba(16,24,40,.04), 0 8px 24px -8px rgba(16,24,40,.12)',
        soft: '0 1px 3px rgba(16,24,40,.06)',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
    },
  },
  plugins: [],
}
