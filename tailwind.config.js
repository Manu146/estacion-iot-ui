/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  purge: {
    enabled: true,
    content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  },
  theme: {
    extend: {},
  },
  plugins: [],
};
