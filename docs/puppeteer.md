# Puppeteer

> Puppeteer 是一个运行在 Node 环境的 NPM 包，它提供了一个高级 API 来通过 DevTools 协议控制 Chromium 或 Chrome。Puppeteer 默认以无头浏览器模式运行，但是可以通过修改配置文件运行“有头”模式。

个人对 Puppeteer 的理解就是：这是一个运行在 Node 环境的 **无头浏览器**，我们可以通过[官方文档](https://zhaoqize.github.io/puppeteer-api-zh_CN/)提供的 API 来使用它做一些事情。可以做哪些事情呢？
- 生成页面 PDF。
- **抓取 SPA（单页应用）并生成预渲染内容（即“SSR”（服务器端渲染））**。这是我们关注的重点！！！
- 自动提交表单，进行 UI 测试，键盘输入等。
- 创建一个时时更新的自动化测试环境。 使用最新的 JavaScript 和浏览器功能直接在最新版本的Chrome中执行测试。
- 捕获网站的 timeline trace，用来帮助分析性能问题。
- 测试浏览器扩展。

## 学习目录

- [先跑个 Demo 看看](#demo)

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
