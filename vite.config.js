import { defineConfig } from "vite";
import { achievementsApi } from "./server/plugin.js";

export default defineConfig({
  plugins: [achievementsApi()],
  server: {
    port: 5173,
    host: true,
    open: true,
  },
  preview: {
    port: 4173,
  },
});
