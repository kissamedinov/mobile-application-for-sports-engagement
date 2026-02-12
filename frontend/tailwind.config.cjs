/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: "class",
    content: ["./index.html", "./src/**/*.{ts,tsx,js,jsx}"],
    theme: {
      extend: {
        colors: {
          emerald: {
            300: "#6ee7b7",
            400: "#34d399",
            500: "#10b981",
            600: "#059669",
          },
        },
      },
    },
    plugins: [],
  };