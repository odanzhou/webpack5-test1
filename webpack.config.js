const Webpack = require('webpack')
const path = require('path')
const fs = require('fs')
const JSONC = require('jsonc-parser')
const HtmlWebpackPlugin = require('html-webpack-plugin')

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
  res[key] = list.map(pathName => path.resolve(cwdPath, pathName))
  return res
}, {})

/**
 * @type { Webpack.WebpackOptionsNormalized }
 */
module.exports = {
  mode: 'development',
  entry: './src/index.tsx',
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
    extensions: ['.ts', '.tsx', '.jsx']
  },
  devtool: 'eval-source-map',
  devServer: {
    static: path.join(cwdPath, 'public'),
    compress: true,
    port: 9000,
    hot: true,
  },
  plugins: [
    new HtmlWebpackPlugin({

    })
  ],
  watch: true,
  watchOptions: {
  }
}