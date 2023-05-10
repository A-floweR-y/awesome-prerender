const path = require('path');
const express = require('express');

class Server {
    constructor(opts = {}) {
        this.options = Object.assign(
            {
                // 静态资源文件夹
                staticDir: '',
            },
            (opts || {})
        );
        // express 的实例
        this.nativeServer = null;
    }

    init() {
        const server = express();
        // 设置静态文件地址
        app.use(express.static(this.options.staticDir));
        app.get('*', (req, res) => {
            res.sendFile(path.join(this.options.staticDir, 'index.html'));
        });
        server.listen(3000);
        this.nativeServer = server;
    }
}

module.exports = Server;

console.log(process.env);
// 测试代码
if (process.env.IS_CODE_TEST) {
    new Server(path.join('./dist')).init();
}