# Webpack 5 ModuleFederation
文档：
1. [Module Federation](https://webpack.docschina.org/concepts/module-federation/)
2. [百度工程师带你了解Module Federation](https://baijiahao.baidu.com/s?id=1757137368593494033&wfr=spider&for=pc)
3. [共享模块：ModuleFederationPlugin](https://www.cnblogs.com/zcookies/p/16131326.html)


### 使用
```typescript
const { ModuleFederationPlugin } = require('webpack').container

plugins = [
  new ModuleFederationPlugin({
    name: 'host',
    remotes: {
      app1: 'app1@http://localhost:3001/remoteEntry.js'
    }
  })
]
```
### 文档
[webpack5模块联邦(Module Federation)](https://zhuanlan.zhihu.com/p/485148715)
[Module Federation](https://webpack.docschina.org/concepts/module-federation/)
