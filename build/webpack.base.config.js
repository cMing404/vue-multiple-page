const VueLoaderPlugin = require('vue-loader/lib/plugin')
const { join, resolve } = require('path')

module.exports = {
  output: {
    path: resolve(__dirname, `../dist`),
    filename: 'assets/js/[name].js',
    // publicPath: '/'
  },
  resolve: {
    extensions: ['*', '.js', '.vue', '.json'],
    alias: {
      '@': join(__dirname, '../src')
    }
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
      },
      {
        test: /\.js$/,
        use: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /le-ui.src.*?js$/,
        loader: 'babel-loader'
      },
      {
        test: /lefit.src.*?js$/,
        loader: 'babel-loader'
      },
      {
        test: /\.less$/,
        use: ['vue-style-loader', 'css-loader', 'postcss-loader', 'less-loader'],
      },
      {
        test: /\.html$/,
        use: [{
          loader: 'html-loader',
          options: {
            root: resolve(__dirname, 'src'),
            attrs: ['img:src', 'link:href']
          }
        }]
      },
      {
        test: /\.(png|jpg|jpeg|gif|eot|ttf|woff|woff2|svg|svgz)(\?.+)?$/,
        exclude: /favicon\.png$/,
        use: [{
          loader: 'url-loader',
          options: {
            limit: 1000,
            name: 'assets/img/[name].[hash:12].[ext]'
          }
        }]
      }
    ]
  },
  plugins: [
    new VueLoaderPlugin()
  ]
}