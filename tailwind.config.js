import { theme } from 'tailwindcss/defaultConfig'

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      opacity: {
        2: 0.02
      },
      fontSize: {
        xxs: "0.625rem",
      },
      boxShadow: {

      },
      fontFamily: {
        sans: ['Inter', 'sans-serif', ...theme.fontFamily.sans ],
      },
      animation: {
        border: "border 2s linear infinite"
      },
      keyframes: {
        border: {
          to: "--border-angle: 360deg",
        }
      }
    },
  },
  plugins: [],
}