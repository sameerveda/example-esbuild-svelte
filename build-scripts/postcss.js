const { readFileSync, statSync } = require('fs');
const { basename } = require('path');
const postcss = require('postcss');
const plugins = [
  require('postcss-nested'),
  // require('tailwindcss'),
  require('autoprefixer'),
];

module.exports.svelte_postcss = {
  // TODO add caching if needed
  style: ({ content, filename }) =>
    postcss(plugins)
      .process(content, { from: undefined })
      .then(({ css }) => ({ code: css })),
};

module.exports.esbuild_postcss = () => ({
  name: 'postcss',
  setup(build) {
    const cache = {};

    build.onLoad(
      { filter: /.\.(css|scss|postcss)$/, namespace: 'file' },
      async ({ path }) => {
        if (path.includes('node_modules') && basename(path).endsWith('.css'))
          return;

        const mtime = statSync(path).mtime.getTime();

        if (mtime !== cache[path]?.mtime) {
          console.log('modified: ', path);
          cache[path] = {
            mtime,
            path,
            data: await postcss(plugins)
              .process(readFileSync(path), { from: path })
              .then(({ css }) => css),
          };
        }

        return {
          contents: cache[path].data,
          loader: 'css',
        };
      }
    );
  },
});
