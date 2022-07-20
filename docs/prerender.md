# Prerender

现在我们开始利用 [Puppeteer](./puppeteer.md) 的内容来实现一个预渲染的功能。

## 目录

- [API](#API)
    - [API-语法](#API-语法)
    - [API-参数](#API-参数)
    - [API-方法](#API-方法)
- [Prerender([, option])](#Prerender([,-option]))

## API

首先我们设计一下 API，来看看它应该具备哪些能力，然后我们再去实现它。

### API-语法

```js
const prerender = new Prerender([, options]);
```

### API-参数

- `options.staticDir`
    - 说明：静态资源地址，也就是我们的 `dist` 目录。
    - 类型：`string`
- `options.routes`
    - 说明：需要预渲染的路由。
    - 类型：`Array\<string\>`

### API-方法

- `prerender.initialize()`
    - 说明：初始化方法。用来做一些初始化的行为。
    - 参数：无
    - 返回值：Promise\<void\>

- `prerender.render()`
    - 说明：开始预渲染。此行为设计成异步的，所以我们需要使用 `Promise`。
    - 参数：无
    - 返回值：Promise\<void\>

- `prerender.destroy()`
    - 说明：销毁预渲染。用于在 `prerender.render()` 方法执行完毕后，销毁预渲染。
    - 参数：无
    - 返回值：无


## Prerender([, option])

我们先来实现一下 `Prerender` 的构造函数。我们需要做哪些事情呢？

1. 因为 Puppeteer 的 `page.goto` 方法只能打开带有 `http 协议` 的 url 地址，所以我们应该有一个静态资源服务模块，来开启一个静态服务。
2. 因为我们需要使用 Puppeteer 来做预渲染。所以，我们最好把 Prerender 的代码也单独封装成一个模块。
3. 我们的 `Prerender` 的构造函数在内部去协调调度 `静态服务模块` 和 `Puppeteer` 模块，来完成预渲染工作。

```js
const Server = require('./server.js');
const Puppeteer = require('./puppeteer.js');

class Prerender {
    constructor(options) {
        // 为了完成主流程，这里就不做参数校验了
        this._options = options;
        // 实例化静态服务
        this._server = new Server(options);
        // 实例化 puppeteer
        this._puppeteer = new Puppeteer(options);
    }
}
```

接下来我们来实现 `Prerender` 的 `initialize()` 方法，并进行一些初始化的行为。

```diff
const Server = require('./server.js');
const Puppeteer = require('./puppeteer.js');

class Prerender {
    constructor(options) {
        // 为了完成主流程，这里就不做参数校验了
        this._options = options;
        // 实例化静态服务
        this._server = new Server(options);
        // 实例化 puppeteer
        this._puppeteer = new Puppeteer(options);
    }

+   async initialize() {
+       // 初始化静态服务
+       await this._server.initialize();
+       // 初始化 puppeteer
+       await this._puppeteer.initialize();
+   }
}
```

