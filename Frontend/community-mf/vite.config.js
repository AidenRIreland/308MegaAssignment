import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import federation from "@originjs/vite-plugin-federation";

export default defineConfig({
  build: {
    target: "esnext", // <== IMPORTANT
  },
  plugins: [
    react(),
    federation({
      dev: true,
      name: "communityMF",
      filename: "remoteEntry.js",
      exposes: {
        "./Community": "./src/components/Community.jsx",
      },
      shared: ["react", "react-dom"],
    }),
  ],
  server: {
    port: 5002,
  },
});
