const colors = require('tailwindcss/colors')

/** @type {import('tailwindcss').Config} */
module.exports = {
  presets: [require("nativewind/preset")],
  content: ["./App.{js,jsx,ts,tsx}", "./app/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#BF3335",
        'dark-gray-light': "#383734",
        "light-gray-light": "#b8b6b2",
        black: "#030207",
        white: colors.white,
        transparent: colors.transparent,
        red: colors.red['500'],
        light: "#edebe6",
        dark: "#121211"
      },
      zIndex: {
        1: '1'
      },
      fontSize: {
        '2.5xl': '27px'
      },
      height: {
        '30': '7.5rem'
      },
      keyframes: {
        fade: {
          from: {
            opacity: 0
          },
          to: {
            opacity: 1
          }
      },
        scaleIn: {
          "0%": {
            opacity: 0,
            transform: "scale(0.9)"
          },
          '50%': {
            opacity: 0.3
          },
          '100%': {
            opacity: 1,
            transform: 'scale(1)'
          }
        }
      },
      animation: {
        fade: 'fade 0.5s ease-in-out',
        scaleIn: 'scaleIn 0.35s ease-in-out',
      }
    },
  },
  plugins: [],
}