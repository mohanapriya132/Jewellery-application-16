/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Cormorant Garamond"', 'serif'],
        body: ['"Jost"', 'sans-serif'],
      },
      colors: {
        obsidian: '#0D0D0D',
        ivory: '#F8F4EE',
        champagne: '#E8D5B0',
        gold: '#C9A84C',
        'gold-light': '#E5C97A',
        'gold-dark': '#9A7A35',
        mist: '#F2EDE8',
        slate: '#3A3A3A',
      },
      letterSpacing: {
        widest2: '0.25em',
        widest3: '0.35em',
      },
    },
  },
  plugins: [],
}
