const glob = require('glob')
const webpack = require('webpack')
const { join } = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin') //使用前需要安装clean-webpack-plugin
const config = require('./webpack.base.config')
const entries = {}
const chunks = []

glob.sync('./src/pages/**/app.js').forEach(path => {
  const chunk = path.split('./src/pages/')[1].split('/app.js')[0]
  entries[chunk] = path
  chunks.push(chunk)
})

// config 配置修改开始
config.mode = 'production'
config.entry = entries
config.output.publicPath = '/promotion'
config.module.rules = config.module.rules.concat([
  {
    test: /\.css$/,
    use: [
      MiniCssExtractPlugin.loader,
      'css-loader'
    ]
  },
])
config.plugins = config.plugins.concat([
  new CleanWebpackPlugin(['dist'], {
    root: join(__dirname, '../')
  }),
  new MiniCssExtractPlugin({
    filename: 'assets/css/[name].css',
    chunkFilename: 'assets/css/[id].css'
  }),
  new webpack.DefinePlugin({
    PRODUCTION: JSON.stringify(true)
  })
])
config.optimization = {
  splitChunks: {
    cacheGroups: {
      vendor: {
        chunks: "initial",
        test: /vue/,
        name: "vendors",
        enforce: true,
      }
    }
  }
}

glob.sync('./src/pages/**/*.html').forEach(page => {
  const folder = page.split('./src/pages/')[1].split('/app.html')[0]
  config.plugins.push(new HtmlWebpackPlugin({
    filename: folder + '.html',
    template: page,
    inject: true,
    favicon: './src/assets/images/lefit.ico',
    hash: false,
    chunks: ['vendors', folder],
    minify: {
      removeComments: true,
      collapseWhitespace: true,
      removeAttributeQuotes: true
    },
  }))
})

// config 配置修改 结束

webpack(config, (err, stats) => {
  if (err || stats.hasErrors()) {
    // 在这里处理错误
    // console.log(err)
  }
  // console.log(stats)
  // 处理完成
})