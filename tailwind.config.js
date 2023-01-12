//this is the tailwind config file, where we can specify particular settings
/** @type {import('tailwindcss').Config} */
module.exports = {
  //what we want purgeCSS to scan for classes and not purge them from the final bundle. In this case, everything from the src folder
  content: ['./src/**/*.{html,ts}'],
  //what we really don't want to purge
  safelist: ['bg-blue-400', 'bg-green-400', 'bg-red-400'],
  //contains properties for modifying colors, font sizes and other features of tailwind
  theme: {
    fontFamily: {
      'sans': ['Roboto', 'sans-serif']
    },
    extend: {},
  },
  //array of plugins to extend tailwind
  plugins: [],
}
