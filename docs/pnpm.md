# pnpm

### 文章
[Linux软连接和硬链接](https://www.cnblogs.com/itech/archive/2009/04/10/1433052.html)
[关于现代包管理器的深度思考——为什么现在我更推荐 pnpm 而不是 npm/yarn?](https://juejin.cn/post/6932046455733485575)
[2023 年了！ pnpm monorepo用起来！](https://juejin.cn/post/7184392660939964474)

### 硬连接与软连接
[Linux 软链接 与 硬链接 的区别](https://blog.csdn.net/weixin_51123079/article/details/128044316)


### 其他
用 pnpm 下载 react-router-dom 在 ts 下报错
通过如下设置，能暂时解决问题，为什么指向不正确，还有待确认
```diff
- "declaration": true,
- "declarationMap": true
+ "declaration": false,
+ "declarationMap": false
```
[Fix re-exports RemixRouter type](https://github.com/remix-run/react-router/pull/9468)