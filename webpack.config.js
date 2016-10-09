const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const nodeExternals = require('webpack-node-externals');

module.exports = {
  entry: [
    './views/components/App.jsx'
  ],
  output: { path: path.join(__dirname, 'dist'), filename: 'bundle.js' },
  module: {
    loaders: [
      {
        test: /\.jsx$/,
        loader: 'babel-loader'
      },
      {
        test: /\.css$/,
        loader: ExtractTextPlugin.extract(
          'style-loader',
          'css-loader?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]'
        )
      }
    ]
  },

  resolve: {
    extensions: ['', '.js', '.jsx', '.json'],
  },

  plugins: [
    new ExtractTextPlugin('styles.css', { allChunks: true })
  ],

  target: 'node', // in order to ignore built-in modules like path, fs, etc.
  externals: [
    nodeExternals(), // in order to ignore all modules in node_modules folder
    /controllers/,
  ]
};
