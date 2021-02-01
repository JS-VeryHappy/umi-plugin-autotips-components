const http = require('http');
const sockjs = require('sockjs');

const init = (port) => {
    
    const socket = sockjs.createServer();

    socket.on('connection', function (conn) {
        conn.on('data', function (message) {
            conn.write(message);
        });
        conn.on('close', function () {
            console.log('关闭连接');
        });
    });

    const server = http.createServer();
    socket.installHandlers(server, {
        prefix: '/autotipsui',
        log: () => { },
    });
    server.listen(port, process.env.HOST || '127.0.0.1');

    return {
        socket,
        server
    }
}

module.exports = {
    init
}