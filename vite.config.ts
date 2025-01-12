import { fileURLToPath, URL } from "node:url";

import vue from "@vitejs/plugin-vue";
import { defineConfig } from "vite";
import compression from 'vite-plugin-compression';
import webfontDownload from 'vite-plugin-webfont-dl';

export default defineConfig({
  plugins: [
    vue(),
    compression({
      algorithm: 'gzip',
      filter: /\.(js|mjs|json|css|html)$/i,
      threshold: 1024
    }),
    webfontDownload()
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
});
