import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import path from "path";
import { TanStackRouterVite } from "@tanstack/router-plugin/vite";

export default defineConfig({
  plugins: [react(), TanStackRouterVite()],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dir, "./src"),
      "@server": path.resolve(import.meta.dir, "../server"),
    },
  },
  server: {
    proxy: {
      "/api": "http://127.0.0.1:3333",
    },
  },
});
