const Webpack = require('webpack')
const path = require('path')
const fs = require('fs')
const JSONC = require('jsonc-parser')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { ModuleFederationPlugin } = Webpack.container

// 共用path 的可以搞个 npm 包
function readJson(jsonPath) {
  const jsonText = fs.readFileSync(jsonPath, "utf8");
  return JSONC.parse(jsonText);
}

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
 * @type { Webpack.WebpackOptionsNormalized }
 */
module.exports = {
  mode: 'development',
  entry: [ 'core-js', './src/index.tsx'],
  output: {
    path: path.resolve(cwdPath, 'dist'),
    filename: '[name].js',
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
  },
  plugins: [
    new ModuleFederationPlugin({
      name: 'webpackAHost', // 当前应用的名称，需要唯一性
      filename: 'remoteEntry.js', // 入口文件名称，用于对外提供模块时候的入口文件名
      exposes: { // 需要导出的模块，用于提供给外部其他项目进行使用
        './search': './src/pages/search', // '@/src/pages/search' // 不能用@的别用方式
      },
      // remotes: {
      //   app1: 'app1@http://localhost:3001/remoteEntry.js'
      // }
    }),
    new HtmlWebpackPlugin({
      template: path.resolve(cwdPath, 'public/index.html')
    })
  ],
  watchOptions: {
    ignored: /node_modules/,
  }
}