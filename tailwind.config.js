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
        lg: "0.75rem",
        xl: "1.2rem",
        "2xl": "1.5rem",
      },
      boxShadow: {
        pop: "0 6px 24px 0 rgba(92, 80, 255, 0.15), 0 1.5px 6px 0 rgba(62, 53, 162, 0.09)",
        smooth: "0 4px 14px 0 rgba(0,0,0,0.07)",
      },
      colors: {
        bg: "#fafafa",
        btn: {
          light: "#5C50FF",
          dark: "#3E35A2",
        },
        border: "rgba(130, 136, 152, 0.5)",
        accent: "#6f6cff", // Til små effekter som x-ikon, hover, linjer
      },
      animation: {
        fadein: "fadein 0.7s cubic-bezier(.4,0,.2,1) both",
        pop: "pop 0.24s cubic-bezier(.4,0,.2,1) both",
      },
      keyframes: {
        fadein: {
          "0%": { opacity: 0, transform: "translateY(30px) scale(0.97)" },
          "100%": { opacity: 1, transform: "translateY(0) scale(1)" },
        },
        pop: {
          "0%": { transform: "scale(0.93)" },
          "60%": { transform: "scale(1.04)" },
          "100%": { transform: "scale(1)" },
        },
      },
    },
  },
  plugins: [
    require("@tailwindcss/filters"),
    require("@tailwindcss/aspect-ratio"),
    require("@tailwindcss/line-clamp"),
  ],
};
