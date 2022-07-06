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