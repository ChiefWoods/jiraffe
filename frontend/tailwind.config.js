/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      animation: {
        "toast-swoop": "toastSwoop 3s ease-in-out forwards",
      },
    },
  },
  plugins: [],
};
