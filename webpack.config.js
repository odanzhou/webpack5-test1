const webpack = require('webpack')
const path = require('path')
const fs = require('fs')
const JSONC = require('jsonc-parser')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const { container: { ModuleFederationPlugin } } = webpack

class TestPlugin {
  constructor (files) {
    this.count = 0
    this.watchFiles = Array.isArray(files) ? files : []
  }
  apply (compiler) {
    console.log('>>>>>>>>>>>applyapplyapplyapply>>>>>>>>>>>>')
    compiler.hooks.compilation.tap('MyPlugin', (compilation) => {
      this.count += 1
      console.log('argsxxx>>>>>>>>>>>>', this.count, this.watchFiles, compilation.fileDependencies)
      if(compilation.fileDependencies && this.watchFiles.length) {
        compilation.fileDependencies.addAll(this.watchFiles)
        console.log('yyyyxxx', compilation.fileDependencies.size)
      }
    })
  }
}

// 共用path 的可以搞个 npm 包
function readJson(jsonPath) {
  const jsonText = fs.readFileSync(jsonPath, "utf8");
  return JSONC.parse(jsonText);
}

console.log('__dirname', __dirname)

const TSConfig = readJson('./tsconfig.json', 'utf-8')
const TSConfPaths = TSConfig.compilerOptions.paths

// 获取工作目录
const cwdPath = process.cwd()
const resolvePaths = Object.entries(TSConfPaths).reduce((res, [key, list]) => {
  const [name, ...others] = key.split('/')
  const suffix = others.join('/')
  res[name] = list.map(pathName => path.resolve(cwdPath, pathName.replace(suffix, '')))
  return res
}, {})
/**
 * @type { webpack.WebpackOptionsNormalized }
 */
module.exports = {
  mode: 'development',
  entry: [ 'core-js', './src/index.tsx'],
  output: {
    path: path.resolve(cwdPath, 'dist'),
    filename: '[name].js',
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.(j|t)s(x)?$/,
        loader: 'babel-loader'
      }
    ]
  },
  resolve: {
    alias: {
      ...resolvePaths,
    },
    extensions: ['.tsx', '.ts', '.jsx', '.js', '...']
  },
  devtool: 'eval-source-map',
  devServer: {
    static: path.join(cwdPath, 'public'),
    compress: true,
    port: 9000,
    hot: true,
    historyApiFallback: true,
    // https://webpack.docschina.org/configuration/dev-server/#devserverallowedhosts
    // 当设置为 'auto' 时，此配置项总是允许 localhost、 host 和 client.webSocketURL.hostname：
    allowedHosts: 'all', // 'auto'|'all'
  },
  plugins: [
    new ModuleFederationPlugin({
      runtime: 'my-runtime-name-xxx', // 穿件一个此名称的运行时chunk，默认为false, 具体作用待明确 TODO
      name: 'webpackAHost', // 当前应用的名称，需要唯一性
      filename: 'remoteEntry.js', // 入口文件名称，用于对外提供模块时候的入口文件名
      exposes: { // 需要导出的模块，用于提供给外部其他项目进行使用
        './search': './src/pages/Search', // '@/src/pages/Search' // 不能用@的别用方式
      }, 
      remotes: {
        libA: 'webpackBHost@http://localhost:9100/remoteEntry.js'
      },
      shared: ['react'],
      // shared1: {
      //   react: {
      //     singleton: true,
      //   },
      //   // 'react-dom': {
      //   //   singleton: true
      //   // }
      // }
    }),
    new HtmlWebpackPlugin({
      template: path.resolve(cwdPath, 'public/index.html')
    }),
    new TestPlugin([__filename]),
  ],
  watchOptions: {
    ignored: /node_modules/,
  }
}