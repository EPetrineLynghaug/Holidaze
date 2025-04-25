/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        figtree: ['"Figtree"', "sans-serif"],
      },
      letterSpacing: {
        "10p": "0.1em",
      },
      borderRadius: {
        lg: "0.75rem", // gjør rounded-lg gyldig med din verdi
      },
      colors: {
        // Hvis du vil speile dine :root-variabler:
        bg: "#fafafa",
        btn: {
          light: "#5C50FF",
          dark: "#3E35A2",
        },
        border: "rgba(130, 136, 152, 0.5)",
      },
    },
  },
  plugins: [require("tailwindcss-filters")],
};
