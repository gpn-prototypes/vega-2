const path = require('path');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const isProduction = process.env.NODE_ENV === 'production';
const root = path.resolve(__dirname);

const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
  mode: isProduction ? 'production' : 'development',

  output: {
    publicPath: process.env.PUBLIC_PATH || '/dist',
  },

  optimization: isProduction
  ? {
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          output: {
            comments: false,
          },
        },
      }),
    ],
  }
  : undefined,

  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          {
            loader: 'css-loader',
            options: {
              modules: {
                localIdentName: '[name]__[local]__[hash:base64:5]',
              },
              importLoaders: 1,
              localsConvention: 'camelCase',
            },
          },
          {
            loader: 'postcss-loader',
            options: require('./postcss.config'),
          },
        ]
      },
      {
        exclude: /node_modules/,
        test: /\.(js|ts|tsx)$/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              babelrc: false,
              configFile: false,
              cacheDirectory: true,
              cacheCompression: isProduction,
              compact: isProduction,
            },
          },
          {
            loader: 'ts-loader',
            options: {
              compiler: 'ttypescript',
              context: root,
            },
          },
        ].filter(Boolean),
      },
      {
        test: /\.(woff|woff2|(o|t)tf|eot)$/,
        use: [
          {
            loader: 'file-loader',
            query: {
              name: `assets/fonts/[name]${isProduction ? '.[hash]' : ''}.[ext]`,
            },
          },
        ],
      },
      {
        test: /\.(jpe?g|png|gif|svg)$/,
        use: [
          {
            loader: 'file-loader',
            query: {
              name: `assets/img/[name]${isProduction ? '.[hash]' : ''}.[ext]`,
            },
          },
        ],
      },
    ],
  },

  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.json'],
    modules: [path.resolve(root, 'node_modules')],
    alias: {
      '@': path.resolve(root, 'src'),
    },
    symlinks: false,
  },

  node: {
    console: true,
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
  },

  plugins: [
    isProduction && new CleanWebpackPlugin(),
    new webpack.ProvidePlugin({ React: 'react' }),
    process.env.ANALYZE && new BundleAnalyzerPlugin(),
    new MiniCssExtractPlugin({
      chunkFilename: `assets/css/[id]${isProduction ? '.[contenthash]' : ''}.css`,
      filename: `assets/css/[name]${isProduction ? '.[contenthash]' : ''}.css`,
    }),
  ].filter(Boolean),
};