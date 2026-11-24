import { build } from 'vite';
import { copyFile } from 'node:fs/promises';

await build({
  base: '/recoverhub/',
  build: {
    outDir: 'docs',
    emptyOutDir: true
  }
});

await copyFile('docs/index.html', 'docs/404.html');
console.log('GitHub Pages build created in docs/');
