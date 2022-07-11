# Puppeteer

> Puppeteer 是一个运行在 Node 环境的 NPM 包，它提供了一个高级 API 来通过 DevTools 协议控制 Chromium 或 Chrome。Puppeteer 默认以无头浏览器模式运行，但是可以通过修改配置文件运行“有头”模式。

个人对 Puppeteer 的理解就是：暂时把它理解为一个运行在 Node 环境的 **无头浏览器**，我们可以通过[官方文档](https://zhaoqize.github.io/puppeteer-api-zh_CN/)提供的 API 来使用它做一些事情。可以做哪些事情呢？

- 生成页面 PDF。
- **抓取 SPA（单页应用）并生成预渲染内容（即“SSR”（服务器端渲染））**。这是我们关注的重点！！！
- 自动提交表单，进行 UI 测试，键盘输入等。
- 创建一个时时更新的自动化测试环境。 使用最新的 JavaScript 和浏览器功能直接在最新版本的Chrome中执行测试。
- 捕获网站的 timeline trace，用来帮助分析性能问题。
- 测试浏览器扩展。

## 学习目录

- [先跑个 Demo 看看](#demo)
- [预渲染原理](#预渲染原理)

## Demo

我们先通过一个简单的示例来了解 Puppeteer。下面是一个在命令行指定一个网址的 url，然后抓取页面的截屏。

```js
/**
 * file: src/screenshot.js
 */

// 引入 puppeteer
const puppeteer = require('puppeteer');
const { program } = require('commander');
const path = require('path');

// 设置一下命令行参数
program.option('-u, --url <url>', 'URL to screenshot');
program.parse();

(async () => {
    // 设置下载截屏图片的地址
    const downloadPath = path.join(__dirname, '../downloads/screenshot.png');
    // 解析参数中的 url
    const { url } = program.opts();
    // 创建一个浏览器实例
    const browser = await puppeteer.launch();
    // 创建一个新的页面实例
    const page = await browser.newPage();
    // 打开指定的 url
    await page.goto(url);
    // 截屏
    await page.screenshot({ path: downloadPath });
    // 关闭浏览器
    await browser.close();
})();
```

为了方便大家操作，我在 `package.json` 中配置了一个 `scripts` 字段，其中包含了一个 `screenshot` 命令，我们可以通过 `yarn  screenshot -u https://www.baidu.com/` 来执行这个命令。

```sh
$ yarn screenshot -u https://www.baidu.com/
```

然后就能在 `src/downloads` 目录下看到一个 `screenshot.png` 文件。

![screenshot.png](../puppeteer/downloads/screenshot.png)

[代码地址](../puppeteer/src/screenshot.js)

## 预渲染原理

当我们的应用为单页面应用时，我们的 `index.html` 文件只有一个 js 入口文件。真正的 DOM 内容是需要页面资源加载完成之后，框架的 `Render 函数` 来渲染真实的 DOM 内容。

预渲染的原理在我们打包完毕之后，使用 Pupperteer 启动一个无头浏览器，然后用这个无头浏览器去访问我们想要缓存的页面路由，当页面资源加载完毕后，框架使用 `Render 函数` 渲染出真实的 DOM 内容。然后我们再通过开启的无头浏览器，来获取页面的完整 HTML 内容。

我们看下面的代码：

```js
// 引入 puppeteer
const puppeteer = require('puppeteer');
const { program } = require('commander');
const path = require('path');
const fs = require('fs');

// 定义命令行参数
program.option('-u, --url <url>', 'URL to screenshot');
// 解析命令行参数
program.parse();

(async () => {
    // 获取命令行参数
    const { url } = program.opts();
    // 创建浏览器
    const browser = await puppeteer.launch();
    // 创建页面
    const page = await browser.newPage();
    // 打开页面
    await page.goto(url);
    // 获取页面内容
    const content = await page.content();
    // 文件存储地址
    const filePath = path.resolve(__dirname, '../downloads', 'content.html');
    // 写入文件
    fs.writeFileSync(filePath, content);
    // 关闭浏览器
    await browser.close();
})();
```

这个时候我们打开看看 html 的[内容](../puppeteer/downloads/content.html)。

看了上面两个例子，我们应该对 Puppeteer 有了一个大概的了解。这里再详细的解释一下 Puppeteer 到底是什么？其实 Puppeteer 只是一个 JSBridge 。我们通过调用 Puppeteer 的 API，来跟无头浏览器 或者 Chrome 内核来通信。也就是说 Puppeteer 是一个独立的 JS 库，只是我们 `yarn add puppeteer` 时，它的项目本身内会自带一个 Chrome 浏览器内核（Mac 下的目录地址：`node_modules/puppeteer/.local-chromium/mac-编码/chrome-mac/Chromium.app/Contents/MacOS/Chromium`）。因为它是一个独立的 JSBridge, 所以我们也可以通过参数 [option.executablePath](https://zhaoqize.github.io/puppeteer-api-zh_CN/#?product=Puppeteer&version=v15.3.1&show=api-puppeteerlaunchoptions) 给它指定一个 Chrome 浏览器（或者 Chrome 内核）的程序路径，来让它使用我们指定的浏览器做渲染。

我们知道了 Puppeteer 是什么，也知道了 Puppeteer 的大致用法。但还有一个问题需要解决：我们该什么时机使用 `page.content()` 去拿页面的内容，才能保证页面的 DOM 内容是完整的。带着这个问题，我们继续往下学习。

## 预渲染的时机

我们首先看一下 `page.content` 方法的介绍。

>  page.content()
> - returns: \<Promise\<string\>\>
> - 返回页面的完整 html 代码，包括 doctype。

从介绍上看，`page.content` 方法是仅用来获取预渲染的结果。也就是说，在 `page.content` 方法调用时，预渲染应该是处于完成状态才对。所以我们再去看看上一个步骤：`page.goto`。

关于 `page.goto` 的介绍：
> page.goto(url[, options])
> - url <string> 导航到的地址. 地址应该带有http协议, 比如 https://
> - options <Object> 导航配置，可选值:
>
> 