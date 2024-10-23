/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  darkMode: "class",
  theme: {},
  variants: {
    extend: {
      screens: {
        ls: "900px",
      },
      brightness: ["dark"],
    },
  },
  plugins: [],
};
