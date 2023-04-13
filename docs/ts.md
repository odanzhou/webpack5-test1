# typescript
### 一些通配符的含义
在 tsconfig.json 往往会设置 "include": [ "./src/**/*" ], 这中间的 ** 表示匹配0或或者更多的目录，* 表示匹配0或者更多的字符
[/**和/*区别](https://blog.csdn.net/bingguang1993/article/details/89182571)
> [/*和/**的区别](https://blog.csdn.net/HeZhiYing_/article/details/104394059)
>/*是指/目录下的所有资源，不包括其子目录下的资源。例如/a.html，/dir
>/**是指/目录下的所有资源，包括其子目录的下的资源。例如/a.html，/dir，/dir/b.html

> [tsconfig.json](https://www.tslang.cn/docs/handbook/tsconfig-json.html)
> * 匹配0或多个字符（不包括目录分隔符）
> ? 匹配一个任意字符（不包括目录分隔符）
> **/ 递归匹配任意子目录

### 文章
#### tsconfig.json
[tsconfig.json](https://www.tslang.cn/docs/handbook/tsconfig-json.html)
[What is a tsconfig.json](https://www.typescriptlang.org/docs/handbook/tsconfig-json.html)
[一些你需要掌握的 tsconfig.json 常用配置项](https://zhuanlan.zhihu.com/p/570939192)
[了不起的 tsconfig.json 指南](https://zhuanlan.zhihu.com/p/285270177)
[Compiler Options](https://www.typescriptlang.org/tsconfig)
[Compiler Options](https://www.typescriptlang.org/zh/tsconfig)

##### 支持 jsx
设置 "jsx": "react"
设置 "jsx": "react-jsx" 就可以不显示引用 React(React 17+)(import React from 'react')了 [umijs faq](https://v3.umijs.org/zh-CN/docs/faq)
> react: 将 JSX 改为等价的对 React.createElement 的调用并生成 .js 文件。
> react-jsx: 改为 __jsx 调用并生成 .js 文件。
> react-jsxdev: 改为 __jsx 调用并生成 .js 文件。
> preserve: 不对 JSX 进行改变并生成 .jsx 文件。
> react-native: 不对 JSX 进行改变并生成 .js 文件。

#### 支持更多类型
[Handling input file extensions other than .ts, .js, .tsx, and .jsx](https://github.com/microsoft/TypeScript/issues/10939)
```json
{
  "compilerOptions": {
    "extensions" : {
      ".ts": "TS",
      ".es": "JS",
      ".js": "JSX"
    }
  }
}
```

#### typescript 全局变量声明文件和模块声明文件那些事儿
[typescript 全局变量声明文件和模块声明文件那些事儿](http://www.javashuo.com/article/p-ahnqywaq-wu.html)

### 只输出 .d.ts 文件

```typescript
{
  "declaration": true,                              /* Generate .d.ts files from TypeScript and JavaScript files in your project. */
  // "declarationMap": true,                           /* Create sourcemaps for d.ts files. */
  "emitDeclarationOnly": true,                      /* Only output d.ts files and not JavaScript files. */
  // "sourceMap": true,                                /* Create source map files for emitted JavaScript files. */
  // "inlineSourceMap": true,                          /* Include sourcemap files inside the emitted JavaScript. */
  // "outFile": "./",                                  /* Specify a file that bundles all outputs into one JavaScript file. If 'declaration' is true, also designates a file that bundles all .d.ts output. */
  "outDir": "./types"
}
```

### 命名空间和模块
[TypeScript中namespace和module的区别](https://www.jianshu.com/p/10900659c5d3)

> 那主要在于文件上：TS里的namespace是跨文件的，JS里的module是以文件为单位的，一个文件一个module。
> TS里的namespace主要是解决命名冲突的问题，会在全局生成一个对象，定义在namespace内部的类都要通过这个对象的属性访问，例如 egret.DisplayObject,egret就是namespace的对象，DisplayObject则是那个类名。因为是注册到全局的，所以跨文件也能正常使用，不同的文件能够读取其他文件注册在全局的命名空间内的信息，也可以注册自己的。namespace其实比较像其他面向对象编程语言里包名的概念

#### 全局扩展
```typescript
declare global {
  interface Array<T> {
    toObservable(): Observable<T>;
  }
}
```