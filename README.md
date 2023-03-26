# webpack5-test1
包管理工具：pnpm

### 项目搭建
打包：Webpack
UI：React + TS

### Webpack
pnpm i webpack webpack-cli -D
增加 webpack.config.js, 通过 Webpack.Configuration 来处理类型

### UI
pnpm i react react-dom -S

### ts
pnpm i typescript -D
#### 配置 tsconfig.json
在根目录创建 tsconfig.json 或者 npx tsc --init
[tsconfig.json](https://www.tslang.cn/docs/handbook/tsconfig-json.html)
[What is a tsconfig.json](https://www.typescriptlang.org/docs/handbook/tsconfig-json.html)
[一些你需要掌握的 tsconfig.json 常用配置项](https://zhuanlan.zhihu.com/p/570939192)
[了不起的 tsconfig.json 指南](https://zhuanlan.zhihu.com/p/285270177)

#### 其他
创建 tsconfig.json 文件会提示错误（No inputs were found in config file...）（不影响但看着不舒服）,通过新增加一个新的.ts文件即可 [tsconfig.json: Build:No inputs were found in config file](https://stackoverflow.com/questions/41211566/tsconfig-json-buildno-inputs-were-found-in-config-file)
加上 include 属性后又报错
[TypeScript 修复错误 No inputs were found in config file](https://www.zadmei.com/txfcwniw.html)
include 中用 "/src/\**/*" 报错，改成 "./src/\**/*" 就好了
重启 VSCode, cmd + shift + p, reloade widnow, 其快捷键不知道为啥没起作用
[编辑扩展程序的配置后如何重新启动VScode？](https://qastack.cn/programming/42002852/how-to-restart-vscode-after-editing-extensions-config)
### 项目目录结构
src: components、hooks、pages、utils、constants