/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#0f172a",
        primary2: "#151d31",
        accent: "#0ea5e9",
      },
    },
  },
  plugins: [],
};
