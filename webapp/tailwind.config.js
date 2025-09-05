/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./templates/**/*.{html,js}",
    "./static/**/*.{js,ts}"
  ],
  safelist: [
    { pattern: /text-(center|right)/ },
    { pattern: /(overflow-x|whitespace)-.*/ }
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: "#c846c2",
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [],
}
