const childProcess = require('child_process');
const staticServer = require('./startServer');
// 启动一个静态服务器
const { url, close } = staticServer();
const openCommand = process.platform === 'darwin'
    ? 'open'
    : process.platform === 'win32'
        ? 'start'
        : 'xdg-open';

// 打开浏览器
childProcess.exec(`${openCommand} ${url}`);

setTimeout(() => {
    // 关闭静态服务器
    close();
    // 关闭子进程
    process.exit();
}, 5000);