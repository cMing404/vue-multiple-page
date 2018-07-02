const { join, resolve } = require('path')
const glob = require('glob')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const publicNname = 'activities'
const CleanWebpackPlugin = require('clean-webpack-plugin') //使用前需要安装clean-webpack-plugin
new CleanWebpackPlugin(
  ['dist/main.*.js','dist/manifest.*.js'],　 //匹配删除的文件
  {
    root: __dirname,  //根目录
    verbose:  true,  //开启在控制台输出信息
    dry: false    //启用删除文件
});
const entries = {}
const chunks = []
glob.sync('./src/pages/**/app.js').forEach(path => {
  const chunk = path.split('./src/pages/')[1].split('/app.js')[0]
  entries[chunk] = path
  chunks.push(chunk)
})

const config = {
  mode: 'production',
  entry: entries,
  output: {
    path: resolve(__dirname, `./${publicNname}`),
    filename: 'assets/js/[name].[chunkhash].js',
    publicPath: `/${publicNname}/`
  },
  resolve: {
    extensions: ['*', '.js', '.vue', '.json'],
    alias: {
      '@': join(__dirname, '/src')
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
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader'
        ]
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
  externals: {
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'assets/css/[name].css',
      chunkFilename: 'assets/css/[id].css'
    }),
    new VueLoaderPlugin(),
    new CleanWebpackPlugin(['activities'], {
      root: __dirname
    }),
    new BundleAnalyzerPlugin({
      analyzerMode: 'server',
      analyzerHost: '127.0.0.1',
      analyzerPort: 8889,
      reportFilename: 'report.html',
      defaultSizes: 'parsed',
      openAnalyzer: true,
      generateStatsFile: false,
      statsFilename: 'stats.json',
      statsOptions: null,
      logLevel: 'info'
    })
  ],
  optimization: {
    splitChunks: {
      cacheGroups: {
        vendor: {
          chunks: "initial",
          test: /vue/,
          // test: resolve(__dirname, "node_modules"), // 路径在 node_modules 目录下的都作为公共部分
          name: "vendors", // 使用 vendor 入口作为公共部分
          enforce: true,
        }
      }
    }
  },
  stats: 'normal'
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
      removeComments: process.env.NODE_ENV === 'production',
      collapseWhitespace: process.env.NODE_ENV === 'production',
      removeAttributeQuotes: process.env.NODE_ENV === 'production'
    },
  }))
})

module.exports = config