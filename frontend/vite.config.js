import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// The dev proxy forwards /api/* to the Spring Boot backend, so the browser
// only ever talks to one origin and CORS never comes into play in dev.
// The backend's own CORS config (SecurityConfig#corsConfigurationSource)
// still matters if you ever call the API directly from a different origin
// (e.g. after building for production and serving the SPA separately).
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      "/api": {
        target: "http://localhost:8080",
        changeOrigin: true,
      },
    },
  },
});
