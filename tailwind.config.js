/** @type {import('tailwindcss').Config} */

module.exports = {
  content: [
    './node_modules/flowbite/**/*.js',
    './node_modules/flowbite-react/**/*.js',
    './pages/**/*.{js,jsx,ts,tsx,html,css,scss}',
    './components/**/*.{js,jsx,ts,tsx,html,css,scss}',
    './containers/**/*.{js,jsx,ts,tsx,html,css,scss}',
  ],
  darkMode: true,
  theme: {
    extend: {},
  },
  corePlugins: {
    preflight: true,
  },
  plugins: [require('flowbite/plugin')],
};
