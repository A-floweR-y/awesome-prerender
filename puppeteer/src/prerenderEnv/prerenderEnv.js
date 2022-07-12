// 引入 puppeteer
const puppeteer = require('puppeteer');
const staticServer = require('./startServer');
// 启动一个静态服务器
const { url, close } = staticServer();

(async () => {
    // 为了方便用户查看，将打开一个非无头浏览器
    const browser = await puppeteer.launch({
        // 使用非无头模式
        headless: false,
    });
    // 启动一个页面
    const page = await browser.newPage();
    // 在页面钟注入环境变量脚本
    await page.evaluateOnNewDocument(function() {
        window.env = {
            isPrerender: true,
        };
    });
    // 访问静态服务器的地址
    await page.goto(url);
    // 等待 5 秒钟之后关闭页面
    await new Promise((done) => setTimeout(done, 5000));
    await browser.close();
    close();
})();