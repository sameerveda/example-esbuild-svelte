// this file only serves the purpose to hide postcss style linting errors. 

const { svelte_postcss } = require("./build-scripts/postcss");

module.exports = {
  preprocess: svelte_postcss,
};
