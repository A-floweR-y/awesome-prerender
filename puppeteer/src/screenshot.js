// 引入 puppeteer
const puppeteer = require('puppeteer');
const { program } = require('commander');
const path = require('path');

// 定义命令行参数
program.option('-u, --url <url>', 'URL to screenshot');
// 解析命令行参数
program.parse();

(async () => {
    // 图片保存路径
    const downloadPath = path.join(__dirname, '../downloads/screenshot.png');
    // 获取命令行参数
    const { url } = program.opts();
    // 创建浏览器
    const browser = await puppeteer.launch();
    // 创建页面
    const page = await browser.newPage();
    // 打开页面
    await page.goto(url);
    // 截图
    await page.screenshot({ path: downloadPath });
    // 关闭浏览器
    await browser.close();
})();