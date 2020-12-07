const dotenv = require('dotenv');
const webpack = require('webpack');
const webpackMerge = require('webpack-merge');
const singleSpaDefaults = require('webpack-config-single-spa-react-ts');
const ImportMapPlugin = require('webpack-import-map-plugin');
const { getAppConfig } = require('./app-config');

const { projectName, port: appPort } = getAppConfig();

function getPort(webpackConfigEnv) {
  let port = process.env.PORT || 3000;
  if (webpackConfigEnv !== undefined && 'port' in webpackConfigEnv) {
    port = webpackConfigEnv.port;
  }
  return port;
}

module.exports = (webpackConfigEnv) => {
  const defaultConfig = singleSpaDefaults({
    orgName: 'vega',
    projectName,
    webpackConfigEnv,
  });

  const PORT = getPort(webpackConfigEnv);
  const YC_DEPLOYMENT = process.env.YC_DEPLOYMENT === 'true'; // Yandex Cloud Deployment
  const NODE_ENV = process.env.NODE_ENV || 'development';
  const BASE_URL = process.env.BASE_URL || `http://localhost:${PORT}`;
  const envConfig = dotenv.config();

  const env = envConfig.error ? {} : envConfig.parsed;

  const envKeys = Object.keys(env).reduce((prev, next) => {
    // eslint-disable-next-line no-param-reassign
    prev[`process.env.${next}`] = JSON.stringify(env[next]);
    return prev;
  }, {});

  if (!process.env.BASE_API_URL) {
    throw new Error('env.BASE_API_URL is empty');
  }

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
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify(NODE_ENV),
        'process.env.YC_DEPLOYMENT': JSON.stringify(YC_DEPLOYMENT),
        'process.env.BASE_API_URL': JSON.stringify(process.env.BASE_API_URL),
        'process.env.BASE_URL': JSON.stringify(BASE_URL),
        ...envKeys,
      }),
      new ImportMapPlugin({
        fileName: 'import-map.json',
        baseUrl: process.env.BASE_URL || `http://locahost:${appPort}`,
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
