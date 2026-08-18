import { defineConfig } from 'vite';
import { resolve } from 'node:path';
import { readdirSync } from 'node:fs';

const docsDir = resolve(import.meta.dirname, 'docs');

function htmlInputs(dir, prefix = '') {
  const entries = {};
  readdirSync(dir, { withFileTypes: true }).forEach((entry) => {
    if (entry.isFile() && entry.name.endsWith('.html')) {
      entries[prefix + entry.name.replace('.html', '')] = resolve(dir, entry.name);
    } else if (entry.isDirectory()) {
      Object.assign(entries, htmlInputs(resolve(dir, entry.name), `${prefix}${entry.name}/`));
    }
  });
  return entries;
}

export default defineConfig({
  root: docsDir,
  base: './',
  publicDir: false,
  build: {
    outDir: resolve(import.meta.dirname, 'docs-dist'),
    emptyOutDir: true,
    minify: 'esbuild',
    sourcemap: false,
    rollupOptions: {
      input: htmlInputs(docsDir)
    }
  },
  server: {
    port: 4173,
    open: false
  }
});