import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5174,
    host: true,
    proxy: {
      "/duel": "http://localhost:8788",
      "/health": "http://localhost:8788"
    }
  },
  build: {
    target: "es2022",
    sourcemap: true
  }
});
