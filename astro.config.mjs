import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://reiarseni.github.io/',
  base: '/git-guia-equipo-astro/',
  output: 'static',
  build: {
    assets: 'assets'
  }
});