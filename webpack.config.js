
const path = require('path');
const root = path.resolve(__dirname);
const port = 3000;
const entry = path.join(root, '/src/index.tsx');
const mainWebpack = require('@ttteam-org/frontend-configs/webpack.config')({ root, port, entry, postCssConfig: require('./postcss.config') });

module.exports = {
  ...mainWebpack,
};