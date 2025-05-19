await Bun.build({
  entrypoints: ['./src/index.html'],
  outdir: './dist',
  minify: true,
  naming: {
    // entry: '[dir]/[name].[ext]',
    chunk: 'index.[ext]',
    // asset: '[name]-[hash].[ext]',
  },
});

import fs from 'node:fs/promises';

let html = await fs.readFile('./dist/index.html', 'utf8')
const js = await fs.readFile('./dist/index.js', 'utf8')
const css = await fs.readFile('./dist/index.css', 'utf8')
html = html.replace('<link rel="stylesheet" crossorigin href="./index.css">', `<style>${css}</style>`)
html = html.replace('<script type="module" crossorigin src="./index.js"></script>', `<script type="module" src="data:text/javascript;base64,${Buffer.from(js).toString('base64')}"></script>`)
await fs.writeFile('./dist/bundle.html', html, 'utf8')

await Bun.build({
  entrypoints: ['./src/extension.js'],
  outdir: './dist',
  external: ['vscode'],
  sourcemap: 'linked',
  minify: false,
  target: 'browser',
  format: 'esm'
});

