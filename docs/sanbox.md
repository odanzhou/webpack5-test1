# 沙箱
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

