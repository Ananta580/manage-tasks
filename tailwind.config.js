/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  darkMode: "class",
  theme: {
    extend: {
      screens: {
        ls: "900px",
      },
    },
  },
  variants: {
    extend: {
      brightness: ["dark"],
    },
  },
  plugins: [],
};
