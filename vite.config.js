import { defineConfig } from 'vite';
import { resolve } from 'node:path';

export default defineConfig({
  build: {
    lib: {
      entry: resolve(import.meta.dirname, 'src/index.js'),
      name: 'Fluxa',
      formats: ['es', 'umd'],
      fileName: (format) => (format === 'es' ? 'fluxa.js' : 'fluxa.umd.cjs')
    },
    cssFileName: 'fluxa',
    cssMinify: 'esbuild',
    minify: 'esbuild',
    sourcemap: true,
    target: 'es2019'
  }
});