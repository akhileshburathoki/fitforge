/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'media',
  theme: {
    extend: {
      colors: {
        accent: {
          50: '#eefbf3',
          100: '#d6f5e1',
          200: '#adebc4',
          300: '#79d9a3',
          400: '#45c07e',
          500: '#22a563',
          600: '#16854f',
          700: '#146a42',
          800: '#125437',
          900: '#10452f',
        },
      },
    },
  },
  plugins: [],
}
