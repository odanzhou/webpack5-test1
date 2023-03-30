# 沙箱
沙箱的核心功能：隔离代码，防止危害就是污染、篡改全局 window 状态
[with 语句](https://wangdoc.com/javascript/types/object#with-%E8%AF%AD%E5%8F%A5)
[https://www.qy.cn/jszx/detail/15204.html](https://www.qy.cn/jszx/detail/15204.html)

### 最简陋简易沙箱
```typescript
// 模拟的执行上下文对象
const ctx = {
  func: (arg) => console.log(arg),
  foo: 'foo'
}
// 最简陋的沙箱
function poorsetSandbox(code, ctx) {
  // 为执行程序构造一个函数作用域，尽量不会影响别的
  eval(code)
}
// 模拟的待执行程序
const code = `
  ctx.foo = 'bar'
  ctx.func(ctx.foo)
`
// 这样模拟是因为一个js文件最顶层就是这样的
poorsetSandbox(code, ctx)
```
~~这样一个沙箱需要在任何时候都提供一个执行上下文，对于ctx的对象(其本意是指向全局的，但我们用了一个对象来拦截住对全局的访问)，这种方式难以控制代码中（指code那段文本）的行为，如果上下文信息缺少了（太容易出现了）就容易报错了~~

> 这样的一个沙箱要求源程序在获取任意变量时都要加上执行上下文对象的前缀，这显然是非常不合理的，因为我们没有办法控制第三方的行为，是否有办法去掉这个前缀呢？

对于上面 code 中的源代码与poorsetSandbox中传入的第二个参数变量名高度耦合，即源代码中必须使用 ctx 去访问，这种太难控制了，所以是最简陋的

### 简易沙箱

``` typescript
// 模拟的执行上下文对象
const ctx = {
  func: (arg) => console.log(arg),
  foo: 'foo'
}
// 最简陋的沙箱
function poorsetSandbox(code, ctx) {
  // 为执行程序构造一个函数作用域，尽量不会影响别的
  with(ctx) { // 避免 ctx 中未模拟到的参数而导致的程序错误
    eval(code)
  }
}

// 模拟的待执行程序
const code = `
  ctx.foo = 'bar'
  ctx.func(ctx.foo)
`
// 这样模拟是因为一个js文件最顶层就是这样的
poorsetSandbox(code, ctx)
```

能避免与ctx变量的强耦合，但还是能够通过window或未定义变量名的方式来突破ctx的模拟限制

### 没那么简陋的沙箱（with + Proxy）

Proxy 中的 get 和 set 方法只能拦截已存在于代理对象中的属性，对于代理对象中不存在的属性这两个钩子是无感知的（对这个保持怀疑）(在 with 下是), 因此可以使用 Proxy.has() 来拦截 with 代码块中的任意变量的访问，并设置一个白名单，在白名单内的变量可以走正常的作用域链的访问方式，不在白名单内的变量会继续判断是否存在沙箱自行维护的上下文对象中，存在则正常访问，不存在则直接报错

```typescript
var a = new Proxy({x: 1}, {
  get(...args) {
    console.log('get', args)
    return Reflect.get(...args)
  },
  set(...args) {
    console.log('set', args)
    return Reflect.set(...args)
  },
})
a.x 
a.x = 2
// a.x 的获取或设置会触发
a.y
a.y = 3
// a.y 的获取或设置也会触发
// 对【 get 和 set 方法只能拦截已存在于代理对象中的属性】保持怀疑
with(a) {
  console.log(x)
}
// 能正常触发

with(a) {
  console.log(y)
}
// 报错，提示 y  为定义
// 【get 和 set 方法只能拦截已存在于代理对象中的属性】应该指的是在with里面的情况
```

[Function 构造函数](https://wangdoc.com/javascript/types/function)
```typescript
var add = new Function(
  'x',
  'y',
  'return x + y'
);
// 上面代码中，Function构造函数接受三个参数，除了最后一个参数是add函数的“函数体”，其他参数都是add函数的参数
```

```typescript
// 用 with 包裹的函数，globalObj 是能够保证传入的值和with只能够的一致
function withedYourCode(code) {
  code = `with(globalObj){ ${code} }`
  return new Function('globalObj', code)
}
// 可访问全局作用域的白名单列表
const access_white_list = ['Math', 'Date']

// 待执行程序源代码
const code = `
  Math.random()
  location.href = 'xxx'
  func(foo)
`

// 执行上下文
const ctx = {
  func: variable => {
    console.log(variable)
  },
  foo: 'foo'
}

// 执行上下文对象的代理对象
const ctxProxy = new Proxy(ctx, {
  has: (target, prop) => { // has 可以拦截 with 代码块中任意属性的访问
    if(access_white_list.includes(prop)) { // 白名单中的属性
      return target.hasOwnProperty(prop)
    }
    if(!target.hasOwnProperty(prop)) {
      throw new Error(`Invalid expression - ${prop}! You can not do that`)
    }
    return true
  }
})

function littlePoorSandbox(code, ctx) {
  withedYourCode(code).call(ctx, ctx) // 将 this 指向手动构造的全局代理对象中
}

littlePoorSandbox(code, ctxProxy)
```

### 基于 iframe 的沙箱
[iframe](https://wangdoc.com/html/iframe)

```typescript
class SandboxGlobalProxy {
  constructor(sharedState) {
    // 创建一个 iframe 对象，取出其中的原生浏览器对象作为沙箱的全局对象
    const iframe = document.createElement('iframe', {url: 'about:blank'})
    document.body.appendChild(iframe)
    const sandGlobal = iframe.contentWindow // 沙箱运行时的全局对象（iframe重的window）
    // return sandGlobal // 发挥它才行
    return new Proxy(sandGlobal, {
      has: (target, prop) => { // has 可以拦截 with 代码块中的任意属性的访问
        if(sharedState.includes(prop)) { // 如果属性存在于共享的全局状态中，则让其沿着原型链在外层查找
            return false
        }
        if(!target.hasOwnProperty(prop)) {
            throw new Error(`Invalid expression - ${prop}! You can not do that!`)
        }
        return true
      }
    })
  }
}

// 用 with 包裹的函数，globalObj 是能够保证传入的值和with只能够的一致
function withedYourCode(code) {
  code = `with(globalObj){ ${code} }`
  return new Function('globalObj', code)
}

function maybeAvailableSandbox(code, ctx) {
  withedYourCode(code).call(ctx, ctx)
}

const code_1 = `
  debugger
  console.log(history == window.history) // fasle
  window.abc = 'sanbox'
  Object.prototype.toString = () => {
    console.log('Traped!')
  }
  console.log(window.abc) // sandbox
`
const sharedGlobal_1 = ['history'] // 希望雨外部执行环境共享的全局对象
const globalProxy_1 = new SandboxGlobalProxy(sharedGlobal_1)

maybeAvailableSandbox(code_1, globalProxy_1)
window.abc // undefined
Object.prototype.toString() // [object Object] 并没有打印 Traped
// 上面代码运行会报错，直接返回 sandGlobal 而不是其代理对象可行
``` 
[proxy-on-window](https://stackoverflow.com/questions/45437583/proxy-on-window)
> the window property is read-only, i.e. it is non-configurable and has no set accessor, it can't be replaced with a proxy.
应该不是上面这个原因造成的
[使用ES6代理和node.js的非法调用错误(Illegal invocation error using ES6 Proxy and node.js)](https://www.656463.com/wenda/syES6dlhnodejsdffdycw_501)
> 通过代理丢失，给你IllegalInvocation错误，因为当你调用它时函数没有上下文
[this 问题](https://es6.ruanyifeng.com/#docs/proxy#this-%E9%97%AE%E9%A2%98)

[使用 ES6 Proxy 代理的 this 问题记录](https://juejin.cn/post/6844903730987401230)
```typescript
class SandboxGlobalProxy {
  constructor(sharedState) {
    // 创建一个 iframe 对象，取出其中的原生浏览器对象作为沙箱的全局对象
    const iframe = document.createElement('iframe', {url: 'about:blank'})
    document.body.appendChild(iframe)
    const sandGlobal = iframe.contentWindow // 沙箱运行时的全局对象（iframe重的window）
    return new Proxy(sandGlobal, {
      has: (target, prop) => { // has 可以拦截 with 代码块中的任意属性的访问
        if(sharedState.includes(prop)) { // 如果属性存在于共享的全局状态中，则让其沿着原型链在外层查找
          return false
        }
        if(!target.hasOwnProperty(prop)) {
          throw new Error(`Invalid expression - ${prop}! You can not do that!`)
        }
        return true
      },
      get(target, key, receiver) {
        debugger
        if(!!target[key] && !!target[key].bind) {
          return target[key].bind(target)
        } else {
          return target[key]
        }
      },
      set(target, key, value, receiver) {
        debugger
        if(key in target) {
          return target[key] = value
        } else {
          Reflect(target, key, value, receiver)
        }
        return true
      },
    })
  }
}

// 用 with 包裹的函数，globalObj 是能够保证传入的值和with只能够的一致
function withedYourCode(code) {
  code = `with(globalObj){ ${code} }`
  return new Function('globalObj', code)
}

function maybeAvailableSandbox(code, ctx) {
  withedYourCode(code).call(ctx, ctx)
}

const code_1 = `

  debugger
  console.log(history == window.history) // fasle
  window.abc = 'sanbox'
  Object.prototype.toString = () => {
    console.log('Traped!')
  }
  console.log(window.abc) // sandbox
`
const sharedGlobal_1 = ['history'] // 希望雨外部执行环境共享的全局对象
const globalProxy_1 = new SandboxGlobalProxy(sharedGlobal_1)

maybeAvailableSandbox(code_1, globalProxy_1)
window.abc // undefined
Object.prototype.toString() // [object Object] 并没有打印 Traped
// 能解决部分问题，但还是报错
```
解决方式应该是不直接代理 window，而是间接代理
```typescript
class SandboxGlobalProxy {
  constructor(sharedState) {
    // 创建一个 iframe 对象，取出其中的原生浏览器对象作为沙箱的全局对象
    const iframe = document.createElement('iframe', {url: 'about:blank'})
    document.body.appendChild(iframe)
    const sandGlobal = iframe.contentWindow // 沙箱运行时的全局对象（iframe重的window）
    return new Proxy({}, {
      has: (target, prop) => { // has 可以拦截 with 代码块中的任意属性的访问
        if(sharedState.includes(prop)) { // 如果属性存在于共享的全局状态中，则让其沿着原型链在外层查找
          return false
        }
        if(!!sandGlobal[prop]) return true
        if(!target.hasOwnProperty(prop)) {
          throw new Error(`Invalid expression - ${prop}! You can not do that!`)
        }
        return true
      },
      get(target, key, receiver) {
        debugger
        if(sandGlobal[key]) {
          if(sandGlobal[key].bind) {
            return sandGlobal[key].bind(sandGlobal)
          }
          return sandGlobal[key]
        }
        if(!!target[key] && !!target[key].bind) {
          return target[key].bind(target)
        } else {
          return target[key]
        }
      },
      set(target, key, value, receiver) {
        if(sandGlobal[key]) {
          sandGlobal[key] = value
          return true
        }
        if(key in target) {
          return target[key] = value
        }
          return true
      },
    })
  }
}

// 用 with 包裹的函数，globalObj 是能够保证传入的值和with只能够的一致
function withedYourCode(code) {
  code = `with(globalObj){ ${code} }`
  return new Function('globalObj', code)
}

function maybeAvailableSandbox(code, ctx) {
  withedYourCode(code).call(ctx, ctx)
}

const code_1 = `
  debugger
  console.log(history == window.history) // fasle
  window.abc = 'sanbox'
  Object.prototype.toString = () => {
    console.log('Traped!')
  }
  console.log(window.abc) // sandbox
`
const sharedGlobal_1 = ['history'] // 希望雨外部执行环境共享的全局对象
const globalProxy_1 = new SandboxGlobalProxy(sharedGlobal_1)

maybeAvailableSandbox(code_1, globalProxy_1)
window.abc // undefined
Object.prototype.toString() // [object Object] 并没有打印 Traped
// 还是不行
```