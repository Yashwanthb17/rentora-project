/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        teal: "#0D5C58",
        darktext: "#163B3A",
        canvas: "#FAF9F6",
        sage: "#E8F0EA",
        softblue: "#EDF5F5",
        beige: "#F3EDE3",
        gold: "#C89B5B",
        secondary: "#536563",
        footer: "#092F2E",
      },
      fontFamily: {
        sans: ["Inter", "Plus Jakarta Sans", "sans-serif"],
      },
    },
  },
  plugins: [],
};
