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