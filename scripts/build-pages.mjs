import { build } from 'vite';
import { copyFile, cp, mkdir, rm, writeFile } from 'node:fs/promises';

await writeFile('index.html', `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="theme-color" content="#090d24" />
    <title>RecoveryHub | Account Assistance</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
`);

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
