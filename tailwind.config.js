/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      keyframes: {
        loadingBar: {
          "0%, 2.5%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(100%)" },
        },
      },
      animation: {
        loadingBar: "loadingBar 11s infinite linear forwards",
      },
    },
  },
  plugins: [],
};
