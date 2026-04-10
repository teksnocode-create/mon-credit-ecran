/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Nunito', 'sans-serif'],
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
      animation: {
        'gradient': 'gradient-shift 6s ease infinite',
        'float': 'float 3s ease-in-out infinite',
      },
      backgroundSize: {
        '400%': '400%',
      }
    },
  },
  plugins: [],
}
