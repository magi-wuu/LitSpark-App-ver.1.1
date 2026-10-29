/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: { colors: { primary: '#102B50', charcoal: '#102B50', cream: '#F4F7FC', 'gray-medium': '#62738A', 'gray-light': '#E1E8F2' } },
  },
  plugins: [],
};
