const http = require('http');
const sockjs = require('sockjs');

const init = port => {
  const socket = sockjs.createServer({
    prefix: '/autotips',
    log: (severity, message) => {
      // console.log(severity, message);
    },
  });

  socket.on('connection', function(conn) {
    conn.on('data', function(clientMsg) {
      const { type, payload } = JSON.parse(clientMsg);

      let message = {
        type: type,
        payload: {},
      };
      switch (type) {
        case 'autotips.components.get.types':
          message.type = type + '/success';
          message.payload = {};
          break;
        default:
      }

      conn.write(JSON.stringify(message));
    });
    conn.on('close', function() {});
  });

  const server = http.createServer();
  socket.installHandlers(server);
  server.listen(port, '127.0.0.1');

  return {
    socket,
    server,
  };
};

module.exports = {
  init,
};
