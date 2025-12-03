import { fileURLToPath, URL } from "node:url";

import vue from "@vitejs/plugin-vue";
import { defineConfig } from "vite";
import compression from 'vite-plugin-compression';
import { VitePWA } from 'vite-plugin-pwa';
import webfontDownload from 'vite-plugin-webfont-dl';

export default defineConfig({
  plugins: [
    vue(),
    compression({
      algorithm: 'gzip',
      filter: /\.(js|mjs|json|css|html)$/i,
      threshold: 1024
    }),
    webfontDownload(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['markdown.png', 'icons/*.png', 'icons/*.jpg', 'og-image.png'],
      filename: 'manifest.json',
      manifest: {
        name: 'PrevueMD - A real-time Markdown editor',
        short_name: 'PrevueMD',
        description: 'A real-time Markdown editor built with Vue. Edit and visualize your Markdown documents instantly.',
        theme_color: '#171717',
        background_color: '#171717',
        display: 'standalone',
        start_url: '/',
        id: '/',
        icons: [
          {
            src: '/icons/manifest-icon-192.maskable.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: '/icons/manifest-icon-512.maskable.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any'
          }
        ],
        screenshots: [
          {
            src: '/icons/apple-splash-2048-1536.jpg',
            sizes: '2048x1536',
            type: 'image/jpeg',
            form_factor: 'wide',
            label: 'PrevueMD Editor Interface - Desktop'
          },
          {
            src: '/pwa-assets/screenshot-narrow.png',
            sizes: '375x667',
            type: 'image/png',
            form_factor: 'narrow',
            label: 'PrevueMD Editor Interface - Mobile'
          }
        ],
        categories: ['productivity', 'utilities', 'developer tools', 'writing', 'documentation'],
        lang: 'en',
        dir: 'ltr',
        orientation: 'any',
        prefer_related_applications: false
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,jpg,ttf,woff,woff2}']
      },
      devOptions: {
        enabled: true,
        type: 'module',
        navigateFallback: 'index.html'
      },
      injectRegister: 'auto',
      strategies: 'generateSW',
      includeManifestIcons: true
    })
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
});
