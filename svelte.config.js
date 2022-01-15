const { svelte_postcss } = require("./build-scripts/postcss");

module.exports = {
  preprocess: svelte_postcss,
};
