import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import federation from "@originjs/vite-plugin-federation";

export default defineConfig({
  plugins: [
    react(),
    federation({
      dev: true,
      remotes: {
        authMF: "http://localhost:4173/assets/remoteEntry.js",
        communityMF: "http://localhost:4174/assets/remoteEntry.js",
        aiMF: "http://localhost:4175/assets/remoteEntry.js",
      },      
      shared: ["react", "react-dom"],
    }),
  ],
  server: {
    port: 5000,
  },
});
