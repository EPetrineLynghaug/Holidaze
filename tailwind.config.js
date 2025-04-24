module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        figtree: ['"Figtree"', "sans-serif"],
      },
      letterSpacing: {
        "10p": "0.1em", // 10% spacing
      },
    },
  },
  plugins: [],
};
