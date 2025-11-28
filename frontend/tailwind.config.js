/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Colores institucionales UNI
        primary: {
          50: '#fdf2f4',
          100: '#fce7eb',
          200: '#f9d0d9',
          300: '#f4a9b9',
          400: '#ec7793',
          500: '#e04d6f',
          600: '#c92d55',
          700: '#a82145',
          800: '#8B1538', // Color principal UNI
          900: '#781a36',
          950: '#420a19',
        },
        secondary: {
          50: '#faf8f5',
          100: '#f5f0e8',
          200: '#e9dece',
          300: '#dbc7a9',
          400: '#c9a97f',
          500: '#bc9262',
          600: '#af7f52',
          700: '#926645',
          800: '#77543d',
          900: '#614634',
          950: '#34241a',
        },
        accent: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
          950: '#082f49',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
