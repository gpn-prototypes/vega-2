require('dotenv').config();
const webpackMerge = require('webpack-merge');
const singleSpaDefaults = require('webpack-config-single-spa-react-ts');
const ImportMapPlugin = require('webpack-import-map-plugin');
const { getAppConfig } = require('./app-config');

const { projectName, port } = getAppConfig();

module.exports = (webpackConfigEnv) => {
  const defaultConfig = singleSpaDefaults({
    orgName: 'vega',
    projectName,
    webpackConfigEnv,
  });

  const config = webpackMerge.smart(defaultConfig, {
    // modify the webpack config however you'd like to by adding to this object
    externals: ['@apollo/client', 'graphql', '@gpn-prototypes/vega-ui'],
    entry: ['./src/singleSpaEntry.tsx'],
    module: {
      rules: [
        {
          test: /\.(png|jpe?g|gif|svg)$/i,
          use: [
            {
              loader: 'file-loader',
            },
          ],
        },
        {
          test: /\.css$/,
          use: [
            {
              loader: 'postcss-loader',
            },
          ],
        },
      ],
    },
    plugins: [
      new ImportMapPlugin({
        fileName: 'import-map.json',
        baseUrl: process.env.BASE_URL || `http://locahost:${port}`,
        filter(x) {
          return ['main.js'].includes(x.name);
        },
        transformKeys(filename) {
          if (filename === 'main.js') {
            return `@vega/${projectName}`;
          }

          return undefined;
        },
      }),
    ],
  });

  return config;
};
