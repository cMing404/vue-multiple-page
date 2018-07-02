const { resolve, join } = require('path')
const webpack = require('webpack')
// const WebpackDevServer = require('webpack-dev-server') 
const glob = require('glob')
const config = require('./webpack.base.config')
const HtmlWebpackPlugin = require('html-webpack-plugin')
let projecties = []
const entries = {}
const chunks = []
// 入口文件寻找
glob.sync('./src/pages/**/app.js').forEach(path => {
  if (!projecties.length || projecties.some(v => path.includes(v))) {
    const chunk = path.split('./src/pages/')[1].split('/app.js')[0]
    entries[chunk] = path
    chunks.push(chunk)
  }
})
// config 配置修改开始
config.mode = 'development'
config.entry = entries
config.output.publicPath = '/'
config.module.rules = config.module.rules.concat([
  {
    test: /\.css$/,
    use: [
      'vue-style-loader',
      'css-loader'
    ]
  },
])
config.plugins = config.plugins.concat([
  new webpack.NamedModulesPlugin(),
  new webpack.HotModuleReplacementPlugin(),
  new webpack.DefinePlugin({
    PRODUCTION: JSON.stringify(false)
  })
])
config.optimization = {
  splitChunks: {
    cacheGroups: {
      vendor: {
        chunks: "initial",
        test: resolve(__dirname, "node_modules"), // 路径在 node_modules 目录下的都作为公共部分
        name: "vendor", // 使用 vendor 入口作为公共部分
        enforce: true,
      },
    }
  }
}

// html模板寻找
glob.sync('./src/pages/**/*.html').forEach(page => {
  if (!projecties.length || projecties.some(v => page.includes(v))) {
    const folder = page.split('./src/pages/')[1].split('/app.html')[0]
    config.plugins.push(new HtmlWebpackPlugin({
      filename: folder + '.html',
      template: page,
      inject: true,
      favicon: './src/assets/images/lefit.ico',
      hash: false,
      chunks: ['vendor', folder]
    }))
  }
})

config.devServer = {
  publicPath: '/',
  contentBase: false,
  compress: true,
  // historyApiFallback: true,
  hot: true,
  // inline: true,
  // noInfo: true,
  port: 9000,
  // host: '0.0.0.0',
  disableHostCheck: true,
  // assetsSubDirectory: 'static',//必须
  proxy: {
    '/lens': {
      target: 'https://test-node-lens.leoao.com',
      changeOrigin: true
    }
  }
}
// config 配置修改结束

module.exports = config