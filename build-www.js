'use strict';
/**
 * Monta app/src/main/assets/www a partir da pasta ../renderer (mesma interface do Windows).
 * Uso:  npm install  &&  node build-www.js
 */
const fs = require('fs');
const path = require('path');
const esbuild = require('esbuild');

const OUT = path.join(__dirname, 'app/src/main/assets/www');
const R = path.join(__dirname, '../renderer');
const TARGET = 'chrome66';

fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(path.join(OUT, 'vendor'), { recursive: true });

// página: viewport de TV, bibliotecas locais e a ponte antes do app.js
let html = fs.readFileSync(path.join(R, 'index.html'), 'utf8');
const swap = (from, to) => {
  if (!html.includes(from)) throw new Error('index.html mudou, não achei: ' + from);
  html = html.replace(from, to);
};
swap('<meta name="viewport" content="width=device-width, initial-scale=1">', '<meta name="viewport" content="width=1280">');
swap('../node_modules/hls.js/dist/hls.min.js', 'vendor/hls.min.js');
swap('../node_modules/mpegts.js/dist/mpegts.js', 'vendor/mpegts.js');
swap('<script src="app.js"></script>', '<script src="bridge.js"></script>\n<script src="app.js"></script>');
fs.writeFileSync(path.join(OUT, 'index.html'), html);

fs.copyFileSync(path.join(R, 'styles.css'), path.join(OUT, 'styles.css'));
fs.copyFileSync(require.resolve('hls.js/dist/hls.min.js'), path.join(OUT, 'vendor/hls.min.js'));
fs.copyFileSync(require.resolve('mpegts.js/dist/mpegts.js'), path.join(OUT, 'vendor/mpegts.js'));

// app.js: só converte a sintaxe para WebViews mais antigas
const t = esbuild.transformSync(fs.readFileSync(path.join(R, 'app.js'), 'utf8'), { target: TARGET, charset: 'utf8' });
fs.writeFileSync(path.join(OUT, 'app.js'), t.code);

// ponte + lógica compartilhada (src/)
esbuild.buildSync({
  entryPoints: [path.join(__dirname, 'bridge/bridge.js')],
  outfile: path.join(OUT, 'bridge.js'),
  bundle: true,
  format: 'iife',
  platform: 'browser',
  target: TARGET,
  charset: 'utf8',
  inject: [path.join(__dirname, 'bridge/shims/buffer-inject.js')],
  alias: {
    crypto: path.join(__dirname, 'bridge/shims/crypto.js'),
    zlib: path.join(__dirname, 'bridge/shims/zlib.js'),
    fs: path.join(__dirname, 'bridge/shims/fs.js'),
    path: path.join(__dirname, 'bridge/shims/path.js'),
  },
  define: { 'process.env.NODE_ENV': '"production"' },
});
console.log('www pronto em', OUT, fs.readdirSync(OUT).join(', '));
