import { defineConfig } from 'vite';
import { resolve } from 'node:path';

export default defineConfig({
  root: resolve(import.meta.dirname, 'docs'),
  base: './',
  publicDir: false,
  build: {
    outDir: resolve(import.meta.dirname, 'docs-dist'),
    emptyOutDir: true,
    minify: 'esbuild',
    sourcemap: false
  },
  server: {
    port: 4173,
    open: false
  }
});