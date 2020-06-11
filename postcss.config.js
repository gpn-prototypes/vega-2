const postcssNestedPlugin = require('postcss-nested');

module.exports = {
  // eslint-disable-next-line global-require
  ...require('@gpn-prototypes/frontend-configs/postcss.config'),
  plugins: [postcssNestedPlugin].filter(Boolean),
};
