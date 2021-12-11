const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')

module.exports = {
  //配置环境
  mode: 'development',

  devtool: 'source-map',

  //配置入口
  entry: {
    'js/app': './src/app.js',
  },
  output: {
    path: path.join(__dirname, './dist'),
    filename: '[name].js',
  },
  //配置插件
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(__dirname, './public/index.html'),
      filename: 'index.html',
      inject: true,
    }),
    new CopyPlugin({
      patterns: [
        {
          from: 'public/favicon.ico',
          to: path.join(__dirname, './dist'),
        },
        {
          from: 'public/libs',
          to: path.join(__dirname, './dist/libs'),
        },
      ],
    }),
    new CleanWebpackPlugin(),
  ],
  module: {
    rules: [
      {
        test: /\.art$/,
        use: {
          loader: 'art-template-loader',
          options: {
            escape: false,
          },
        },
      },
      {
        test: /\.css$/,
        loaders: ['style-loader', 'css-loader'],
      },
    ],
  },

  //配置server
  devServer: {
    contentBase: path.join(__dirname, './dist'),
    // compress: true,
    port: 8080,
    proxy: {
      '/api': { target: 'http://localhost:3000' },
    },
  },
}
