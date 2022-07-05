const puppeteer = require('puppeteer');
const { program } = require('commander');
const path = require('path');

program.option('-u, --url <url>', 'URL to screenshot');
program.parse();

(async () => {
    const downloadPath = path.join(__dirname, '../downloads/screenshot.png');
    const { url } = program.opts();
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url);
    await page.screenshot({ path: downloadPath });
    await browser.close();
})();