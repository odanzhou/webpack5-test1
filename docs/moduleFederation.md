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
[webpack5模块联邦(Module Federation)](https://zhuanlan.zhihu.com/p/485148715) 按照这个来的
[Module Federation](https://webpack.docschina.org/concepts/module-federation/)
[module-federation-plugin](https://webpack.docschina.org/plugins/module-federation-plugin)
[调研 Federated Modules](https://mp.weixin.qq.com/s/sdIVsfmRlhDtT6DF2dmsJQ)
[demo](https://github.com/module-federation/module-federation-examples/)
[最详细的Module Federation的实现原理讲解](https://juejin.cn/post/7151281452716392462)

#### 和 external 的区别？
external 需要自行在 html 引入相关 script，此方案只需引一个 runtime 文件，runtime 里维护了 chunk 的映射表
external 需要自行处理库的依赖，比如 antd 依赖 moment，那么就需要分别引 moment 和 antd 的 umd 文件，并且保证顺序
external 没法拆包，比如 antd 只能引一个大的 antd，此方案可以拆，比如只用了 Button，可以不引整个 antd

结合平台可以做一些自动化的事情，可以发挥更大价值。比如自动把我们的常用依赖定期打包，然后大家不管是开发环境还是生产环境都依赖统一的 runtime。打包可以是打大包，比如 ant-design-pro 可以把相关的；也可以是打小包，然后利用 cdn 的 combo 机制合到一起，如果是打小包，大量重复的 runtime 合一起还是有点大，需要提下

Umi 内置的开发依赖比如 socket.io、webpack-hot-middleware、@babel/runtime、core-js 等也可以提前打出来通过 runtime 的方式引入

和此前大量利用缓存的方案不同，不是二次编译快，而是首次编译就快

可以支持多版本，比如同时有 antd 3 和 antd 4

codesandbox 之前做过 webpack dll 的 cdn，我觉得和这个的思路很像，常用依赖全部上 cdn，项目开发只打包本地依赖

借助 http/2（现在的 cdn 基本都是了），性能不一定受影响，可能因为整体尺寸小了而变得更好了

有 library cdn 后，Bundlerless 更容易做了

在中后台这种不太介意整体尺寸的场景更容易快步推进，但性能问题可解

#### 缺点
主要是引入的方式需要改成异步
```typescript
// import React from 'react'
const React =  awaitimport('libs/react');

```
对于某些依赖来说 external （比如 react 和 react-dom）可能更合适，但也有一些自动化的方式可以系统地解决此问题，使用此方案的同时并既然使用老的写法

### 监听外部模块
[webpack 监听外部文件变更](https://www.keisei.top/watch-external-files-webpack-plugin/)
[如何使用Webpack插件在编译后修改和重新解析模块？](https://www.php1.cn/detail/Webpack_ChaJian__b167e22a.html)
[webpack-dev-server启动的前端项目使用nodemon监听自动重启](https://blog.51cto.com/u_15713165/5459778)

```typescript
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
        compilation.fileDependencies.addAll(this.watchFiles) // 监听的文件
        console.log('yyyyxxx', compilation.fileDependencies.size)
      }
    })
  }
}
```
但没解决我想要解决的问题，即 webpack.config.js 变化后要重新有效果，发现这个只能是重启webpack才行，而不是仅仅触发文件变化

#### nodemon
好像nodemon能解决我的疑问，或者看下umi中是如何实现的
[nodemon入门介绍](https://zhuanlan.zhihu.com/p/96720675)
[Node 工具 | nodemon 详解](https://www.jianshu.com/p/a35dfc72c6e6)
[利用nodemon监听配置文件并重启webpack server](https://zhuanlan.zhihu.com/p/409880360)
[nodemon和pm2快速部署服务](https://blog.csdn.net/bobo789456123/article/details/125584876)
[Node 工程师应当掌握的 PM2](https://baijiahao.baidu.com/s?id=1665037401501338559&wfr=spider&for=pc)
> nodemon是一个用来监视node.js应用程序中的任何更改并自动重启服务,非常适合用在开发环境中。
> pm2是一个进程管理工具,可以用它来管理你的node进程，并查看node进程的状态，当然也支持性能监控，
进程守护，负载均衡等功能。
> 总结
> nodemon运行在开发环境，不占用进程，关闭了这个服务也就关闭了，
> pm2是一个运行在服务端后台开发，不占用终端，但是这个启动服务后这个进程仍然存在，作用都差不多哦
