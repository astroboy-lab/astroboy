## Astroboy 和 Koa

### 1. koa


> Koa 是一个新的 web 框架，由 Express 幕后的原班人马打造， 致力于成为 web 应用和 API 开发领域中的一个更小、更富有表现力、更健壮的基石。

Koa 和 Express 的设计风格非常类似，底层也都是共用的同一套 HTTP 基础库，但是有几个显著的区别，除了上面提到的默认异步解决方案之外，主要的特点还有下面几个。

#### Middleware

Koa 的中间件和 Express 不同，Koa 选择了洋葱圈模型。

中间件洋葱图：

![洋葱模型](../images/2.png)

中间件执行顺序图：

![中间件执行顺序图](../images/3.gif)

所有的请求经过一个中间件的时候都会执行两次，对比 Express 形式的中间件，Koa 的模型可以非常方便的实现后置处理逻辑，对比 Koa 和 Express 的 Compress 中间件就可以明显的感受到 Koa 中间件模型的优势。

#### Context

和 Express 只有 Request 和 Response 两个对象不同，Koa 增加了一个 Context 的对象，作为这次请求的上下文对象（在 Koa 1 中为中间件的 this，在 Koa 2 中作为中间件的第一个参数传入）。我们可以将一次请求相关的上下文都挂载到这个对象上。类似 traceId 这种需要贯穿整个请求（在后续任何一个地方进行其他调用都需要用到）的属性就可以挂载上去。相较于 request 和 response 而言更加符合语义。

同时 Context 上也挂载了 Request 和 Response 两个对象。和 Express 类似，这两个对象都提供了大量的便捷方法辅助开发，例如

* get request.query
* get request.hostname
* set response.body
* set response.status

#### 异常处理

通过同步方式编写异步代码带来的另外一个非常大的好处就是异常处理非常自然，使用 try catch 就可以将按照规范编写的代码中的所有错误都捕获到。这样我们可以很便捷的编写一个自定义的错误处理中间件。

```
async function onerror(ctx, next) {
  try {
    await next();
  } catch (err) {
    ctx.app.emit('error', err);
    ctx.body = 'server error';
    ctx.status = err.status || 500;
  }
}
```

只需要将这个中间件放在其他中间件之前，就可以捕获它们所有的同步或者异步代码中抛出的异常了。

### 2. Astroboy

Astroboy 选择了 Koa 作为其基础框架，并在它的模型基础上，进一步对它进行了一些增强。

#### 扩展

在基于 Astroboy 的框架或者应用中，我们可以通过定义 app/extends/{application,context,request,response}.js 来扩展 Koa 中对应的四个对象的原型，通过这个功能，我们可以快速的增加更多的辅助方法，例如我们在 app/extends/context.js 中写入下列代码：

```js
// app/extend/context.js
module.exports = {
  get isIOS() {
    const iosReg = /iphone|ipad|ipod/i;
    return iosReg.test(this.get('user-agent'));
  },
};
```

在 Controller 中，我们就可以使用到刚才定义的这个便捷属性了：

```js
// app/controllers/index/IndexController.js
exports.handler = ctx => {
  ctx.body = ctx.isIOS
    ? 'Your operating system is iOS.'
    : 'Your operating system is not iOS.';
};
```