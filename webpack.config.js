
const path = require('path');
const root = path.resolve(__dirname);
const port = 3000;
const entry = path.join(root, '/src/index.tsx');
const publicPath = process.env.PUBLIC_PATH || './';

console.log(publicPath)

module.exports = {
  ...require('@ttteam-org/frontend-configs/webpack.config')({ root, port, entry, publicPath })
};