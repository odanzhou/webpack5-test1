# webpack5-test1
包管理工具：pnpm

### 项目搭建
打包：Webpack
UI：React + TS

### Webpack
pnpm i webpack webpack-cli -D
增加 webpack.config.js, 通过 Webpack.WebpackOptionsNormalized 来处理类型

### UI
pnpm i react react-dom -S
pnpm i @types/react @types/react-dom -D

### ts
pnpm i typescript -D
#### 配置 tsconfig.json
1. 在根目录创建 tsconfig.json 或者 npx tsc --init
[tsconfig.json](https://www.tslang.cn/docs/handbook/tsconfig-json.html)
[What is a tsconfig.json](https://www.typescriptlang.org/docs/handbook/tsconfig-json.html)
[一些你需要掌握的 tsconfig.json 常用配置项](https://zhuanlan.zhihu.com/p/570939192)
[了不起的 tsconfig.json 指南](https://zhuanlan.zhihu.com/p/285270177)

2. 设置 "noEmit": true, 不输出tsc打包后的文件
#### 其他
创建 tsconfig.json 文件会提示错误（No inputs were found in config file...）（不影响但看着不舒服）,通过新增加一个新的.ts文件即可 [tsconfig.json: Build:No inputs were found in config file](https://stackoverflow.com/questions/41211566/tsconfig-json-buildno-inputs-were-found-in-config-file)
加上 include 属性后又报错
[TypeScript 修复错误 No inputs were found in config file](https://www.zadmei.com/txfcwniw.html)
include 中用 "/src/\**/*" 报错，改成 "./src/\**/*" 就好了
通过设置 "baseUrl": "./" 也可以解决上面的问题(哦，并不能)
重启 VSCode, cmd + shift + p, reloade widnow, 其快捷键不知道为啥没起作用
[编辑扩展程序的配置后如何重新启动VScode？](https://qastack.cn/programming/42002852/how-to-restart-vscode-after-editing-extensions-config)

### 项目目录结构
src: components、hooks、pages、utils、constants

### babel
[babel](https://babeljs.io/docs/)
基础: pnpm i -D @babel/core @babel/cli @babel/preset-env
polyfill: pnpm i -S @babel/polyfill (配合 "useBuiltIns": "usage")
支持react: pnpm i @babel/preset-react -D
支持ts: pnpm i @babel/preset-typescript -D
webpack loader: pnpm i babel-loader -D

#### 创建babel配置文件
根目录下创建 babel.config.json (v7.8.0 及以上) 或者 babel.config.js（老版本）
webpack 增加 [babel-loader](https://webpack.docschina.org/loaders/babel-loader/)

### 关联html文件和js代码
pnpm i -S html-webpack-plugin

### 遇到的坑
##### 处理文件名扩展问题
extensions: ['.ts', '.tsx', '.jsx']
导致覆盖了默认的文件扩展名，无法使用 [resolve.extensions](https://webpack.docschina.org/configuration/resolve#resolveextensions)
extensions: ['.tsx', '.ts', '.jsx', '.js', '...']

##### polyfill
报错：
```typescript
ES Modules may not assign module.exports or exports.*, Use ESM export syntax, instead: ./node_modules/.pnpm/core-js@2.6.12/node_modules/core-js/modules/_descriptors.js
    at Object.set [as exports]
```
把 babel 中的 useBuiltIns删除就没问题了
```typescript
[
  "@babel/preset-env", {
    "useBuiltIns": "usage"
  }
]
```
需要下载 core-js，还是没能解决值为usage时的问题，在[8982](https://github.com/odanzhou/webpack5-test1/commit/89820b6f61bbe3e8458b887f0f7d5cc5b8004eac)这个commit下，不同的browserslist值，警告错误还不一样
```typescript
[
  "@babel/preset-env", {
    "useBuiltIns": "usage",
    "corejs": 3
  }
]
```
使用 "useBuiltIns": "entry" 也行

[Error: ES Modules may not assign module.exports or exports.*, Use ESM export syntax, instead: 581](https://github.com/babel/babel/issues/12731)

#### React is not defined
pnpm i -D @babel/plugin-transform-react-jsx 
[React Plugin](https://babeljs.io/docs/babel-plugin-transform-react-jsx#react-automatic-runtime-2)
不清楚 react/jsx-runtime  custom-jsx-library/jsx-runtime 这两者之间有什么差异
[React 17中的新JSX增强功能](https://www.jianshu.com/p/ea33391817c7)
[manual-babel-setup](https://legacy.reactjs.org/blog/2020/09/22/introducing-the-new-jsx-transform.html#manual-babel-setup)


### 路由
pnpm i -S react-router-dom
createBrowserRouter： 刷新后就报错了，目前还没找到开发环境的解决办法，开发环境需要配合 historyApiFallback 属性
createHashRouter：好用