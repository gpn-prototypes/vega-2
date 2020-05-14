const path = require('path');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const isProduction = process.env.NODE_ENV === 'production';
const root = path.resolve(__dirname);

const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const TerserPlugin = require('terser-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const styleLoader = isProduction ? MiniCssExtractPlugin.loader : 'style-loader';

module.exports = {
  mode: isProduction ? 'production' : 'development',

  entry: __dirname + '/src/index.tsx',

  output: {
    publicPath: process.env.PUBLIC_PATH || '',
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
          styleLoader,
          {
            loader: 'css-loader',
            options: {
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

  devServer: { 
    contentBase: './public',
    port: 3000,
  }, 

  plugins: [
    isProduction && new CleanWebpackPlugin(),
    new webpack.ProvidePlugin({ React: 'react' }),
    process.env.ANALYZE && new BundleAnalyzerPlugin(),
    new MiniCssExtractPlugin({
      filename: '[name].css',
      chunkFilename: '[id].css',
      // chunkFilename: `assets/css/[id]${isProduction ? '.[contenthash]' : ''}.css`,
      // filename: `assets/css/[name]${isProduction ? '.[contenthash]' : ''}.css`,
    }),
    new HtmlWebpackPlugin({
      template: __dirname + '/public/index.html',
      inject: 'body',
    }),
  ].filter(Boolean),
};