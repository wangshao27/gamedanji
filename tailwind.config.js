/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Apple-inspired color palette
        'apple-blue': '#007AFF',
        'apple-green': '#34C759',
        'apple-indigo': '#5856D6',
        'apple-orange': '#FF9500',
        'apple-pink': '#FF2D55',
        'apple-purple': '#AF52DE',
        'apple-red': '#FF3B30',
        'apple-teal': '#5AC8FA',
        'apple-yellow': '#FFCC00',
        'apple-gray': {
          100: '#F5F5F5',
          200: '#EEEEEE',
          300: '#E0E0E0',
          400: '#BDBDBD',
          500: '#9E9E9E',
          600: '#757575',
          700: '#616161',
          800: '#424242',
          900: '#212121',
        },
      },
    },
  },
  plugins: [],
}
