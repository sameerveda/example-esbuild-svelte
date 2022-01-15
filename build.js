const { build, watch, cliopts } = require('estrella');
const { svelte_postcss, esbuild_postcss } = require('./build-scripts/postcss');
const sveltePlugin = require('esbuild-svelte');

build({
  entryPoints: ['./src/main.js'],
  bundle: true,
  outdir: './public/build/',
  logLevel: 'info',
  plugins: [
    sveltePlugin({ preprocess: svelte_postcss }),
    // handle files which are not handled by sveltePlugin like imports and raw non .svelte css/postcss files
    esbuild_postcss(),
  ],
  color: true,
  minify: !cliopts.watch,
  sourcemap: cliopts.watch,
  clear: false,
});

cliopts.watch &&
  require('serve-http').createServer({
    port: 3000,
    pubdir: require('path').join(__dirname, 'public'),
  });
