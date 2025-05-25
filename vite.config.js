import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindPostcss from "@tailwindcss/postcss";
import autoprefixer from "autoprefixer";
import { visualizer } from "rollup-plugin-visualizer";

export default defineConfig({
  plugins: [
    react(),
    visualizer({
      filename: "./dist/stats.html",
      open: false,
      gzipSize: true,
    }),
  ],
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
          // Splitt ut React
          react: ["react", "react-dom", "react-dom/client"],
          // Én egen chunk for Recharts + D3
          recharts: [
            "recharts",
            "d3-scale",
            "d3-shape",
            "d3-time-format",
            "d3-color",
            "d3-format",
          ],
          // Splitt ut react-date-range
          reactDateRange: ["react-date-range"],
          // Samle per-importede date-fns-funksjoner
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
