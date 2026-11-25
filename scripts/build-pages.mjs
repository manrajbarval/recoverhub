import { build } from 'vite';
import { copyFile, cp, mkdir, rm, writeFile } from 'node:fs/promises';

await build({
  base: '/recoverhub/',
  build: {
    outDir: 'dist',
    emptyOutDir: true
  }
});

await rm('assets', { recursive: true, force: true });
await mkdir('assets', { recursive: true });
await cp('dist/assets', 'assets', { recursive: true });
await copyFile('dist/index.html', 'index.html');
await copyFile('dist/index.html', '404.html');
await writeFile('.nojekyll', '');
console.log('GitHub Pages build created at repository root.');
