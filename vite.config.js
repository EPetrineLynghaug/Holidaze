// vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindPostcss from "@tailwindcss/postcss";
import autoprefixer from "autoprefixer";

export default defineConfig({
  plugins: [react()],
  css: {
    postcss: {
      plugins: [tailwindPostcss(), autoprefixer()],
    },
  },
  build: {
    outDir: "dist",
    chunkSizeWarningLimit: 1500,
    rollupOptions: {
      output: {
        manualChunks: {
          react: ["react", "react-dom", "react-dom/client"],
          recharts: [
            "recharts",
            "d3-scale",
            "d3-shape",
            "d3-time-format",
            "d3-color",
            "d3-format",
          ],
          reactDateRange: ["react-date-range"],
          datefns: [
            "date-fns/format",
            "date-fns/addDays",
            "date-fns/startOfWeek",
            "date-fns/endOfWeek",
            "date-fns/startOfDay",
            "date-fns/endOfDay",
          ],
        },
      },
    },
  },
});
