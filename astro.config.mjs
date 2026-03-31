import { defineConfig } from 'astro/config';
import AstroPWA from '@vite-pwa/astro';

export default defineConfig({
  site: 'https://reiarseni.github.io/',
  base: '/git-guia-equipo-astro/',
  output: 'static',
  build: {
    assets: 'assets'
  },
  integrations: [
    AstroPWA({
      registerType: 'autoUpdate',
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,woff2}'],
        runtimeCaching: [{
          urlPattern: /^https:\/\/reiarseni\.github\.io\/git-guia-equipo-astro\/.*/,
          handler: 'StaleWhileRevalidate',
        }]
      },
      manifest: false
    })
  ]
});