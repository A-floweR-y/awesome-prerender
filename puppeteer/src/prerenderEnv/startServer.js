const express = require('express');
const path = require('path');

module.exports = (port = 3000) => {
    const app = express();
    app.use(express.static(path.join(__dirname)));
    const server = app.listen(port);

    const close = () => {
        console.log('close server');
        server.close();
    };
    const url = `http://localhost:${port}`;

    return { close, url };
};