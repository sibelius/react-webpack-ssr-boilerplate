const path = require('path');

const nodeExternals = require('webpack-node-externals');

const webpack = require('webpack');

const ReloadServerPlugin = require('./webpack/ReloadServerPlugin');
const dotEnv = require('dotenv-webpack');
const babelConfigServer = require('./babel.server.config');

const cwd = process.cwd();

const filename = 'api.js';

module.exports = {
  context: cwd,
  mode: 'development',
  devtool: false,
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.json', '.mjs'],
  },
  entry: {
    server: ['./src/server/index.ts'],
  },
  output: {
    // libraryTarget: 'commonjs2',
    path: path.resolve('build'),
    filename,
    futureEmitAssets: true,
  },
  watch: true,
  target: 'node',
  externals: [
    nodeExternals({
      allowlist: [],
    }),
  ],
  module: {
    rules: [
      {
        test: /\.mjs$/,
        type: 'javascript/auto',
      },
      {
        test: /\.(js|jsx|ts|tsx)?$/,
        use: {
          loader: 'babel-loader?cacheDirectory',
          options: babelConfigServer,
        },
        exclude: [
          /node_modules/,
          path.resolve(__dirname, '.serverless'),
          path.resolve(__dirname, '.webpack'),
        ],
      },
    ],
  },
  plugins: [
    new dotEnv({
      path: './.env',
    }),
    // new webpack.HotModuleReplacementPlugin(),
    new ReloadServerPlugin({
      script: path.resolve('build', filename),
    }),
  ],
  node: {
    __dirname: false,
    __filename: false,
    fs: 'empty',
  },
};
