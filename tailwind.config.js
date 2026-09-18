/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/flowbite/**/*.js",
    "./node_modules/flowbite-react/**/*.js"
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#fdf8ed',
          100: '#faedc7',
          200: '#f5d98a',
          300: '#f0c04d',
          400: '#eba924',
          500: '#d98f10',
          600: '#ab6c0f',
          700: '#8a5511',
          800: '#714514',
          900: '#5f3a15',
          950: '#361e09',
        },
        accent: {
          50: '#fff8ec',
          100: '#ffecc8',
          200: '#ffd68c',
          300: '#ffbb4f',
          400: '#fea023',
          500: '#ed9810',
          600: '#cf720b',
          700: '#ac500c',
          800: '#8c3f11',
          900: '#733511',
        },
        ink: {
          50: '#f7f7f8',
          100: '#eeeef0',
          200: '#dcdce1',
          300: '#bfc0c8',
          400: '#9a9ba7',
          500: '#7c7d8a',
          600: '#636471',
          700: '#50505c',
          800: '#35353e',
          900: '#212127',
          950: '#0f0f13',
        },
      },
      fontFamily: {
        uniquifier: ["Playfair Display", "serif"],
        sans: ["Manrope", "system-ui", "sans-serif"],
        display: ["Outfit", "system-ui", "sans-serif"],
      },
      borderRadius: {
        xl2: '1.25rem',
      },
      boxShadow: {
        soft: '0 1px 2px 0 rgba(15, 15, 19, 0.06)',
        card: '0 1px 3px 0 rgba(15, 15, 19, 0.08), 0 1px 2px -1px rgba(15, 15, 19, 0.06)',
        'card-hover': '0 8px 20px -4px rgba(15, 15, 19, 0.12), 0 2px 6px -2px rgba(15, 15, 19, 0.08)',
        glow: '0 0 0 4px rgba(235, 169, 36, 0.18)',
      },
      keyframes: {
        rotate: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
      },
      animation: {
        rotate: 'rotate 4s linear infinite',
      },
    },
  },
  plugins: [ require('flowbite/plugin')],
}

