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

    async initialize() {
        await this._server.initialize();
        await this._puppeteer.initialize();
    }
}