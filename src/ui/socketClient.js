import sockjs from 'sockjs-client';

let socket = null;

export async function socketClient(url, option = {}) {
  const { onMessage, onError } = option;
  return new Promise((resolve, reject) => {

    function handler(e) {
      const { type, payload } = JSON.parse(e.data);
      if (onMessage) {
        onMessage({ type, payload });
        // socket.send(
        //   JSON.stringify({}),
        // );
      }
    }

    socket = new sockjs(url);
    socket.onopen = () => {
      resolve();
    };
    socket.onmessage = handler;
    socket.onclose = e => {
      console.error('连接关闭:', e);
      socket = null;
      if (onError) {
        onError(e);
      }
    };
    return socket;
  });
}

