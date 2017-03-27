const path = require('path');

module.exports = {
  output: {
    path: path.join(__dirname, 'public'),
    filename: 'bundle.js',
    publicPath: '/public/'
  },
  module: {
    loaders: [{
      test: /\.js$/,
      loader: 'babel',
      include: path.join(__dirname, 'src')
    }, {
      test: /\.css$/,
      loader: 'style!css',
      include: path.join(__dirname, 'css')
    }, {
      test: /\.(jpg|png|svg)$/,
      loader: 'file-loader',
      options: {
        name: './images/[hash].[ext]',
      },
    }]
  },
    node: {
        fs: "empty"
    }
};
