/* Build the studio into one self-contained HTML file.
 * Everything is inlined — acorn, magic-string, the app, and the starter deck as
 * a demo — so the page runs from an artifact, a static host, or a local server
 * with nothing to install. */
import { build } from 'esbuild';
import fs from 'node:fs';

const demo = fs.readFileSync('../assets/starter.html', 'utf8');

const { outputFiles } = await build({
  entryPoints: ['src/app.js'],
  bundle: true, minify: true, format: 'iife', target: 'es2022',
  write: false, legalComments: 'none',
});
const js = outputFiles[0].text;

/* the demo deck contains a literal </script>, which would close the host script
   tag early — and so could any deck string we ever inline. */
const safe = s => s.replace(/<\//g, '<\\/');

const shell = fs.readFileSync('src/shell.html', 'utf8');
const out = shell.replace('/*BUNDLE*/',
  () => `window.DEMO_SOURCE=${safe(JSON.stringify(demo))};\n${safe(js)}`);

fs.writeFileSync('studio.html', out);

/* The same page for an artifact host, which supplies its own document skeleton
   and wants the content only. */
const inner = [
  /<title>[\s\S]*?<\/title>/.exec(out)[0],
  /<style>[\s\S]*?<\/style>/.exec(out)[0],
  /<body>([\s\S]*)<\/body>/.exec(out)[1].trim(),
].join('\n');
fs.writeFileSync('studio.artifact.html', inner);

const kb = s => (s.length / 1024).toFixed(0);
console.log(`studio.html           ${kb(out)} KB  (app ${kb(js)} KB, demo deck ${kb(demo)} KB)`);
console.log(`studio.artifact.html  ${kb(inner)} KB  (no document wrapper)`);
