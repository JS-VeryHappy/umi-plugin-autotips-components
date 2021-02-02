import sockjs from 'sockjs-client';

let socket = null;
const messageHandlers = [];

export async function socketClient(url, option = {}) {
  const { onMessage, onError } = option;
  return new Promise((resolve, reject) => {
    /**
     * 接收到消息后调用回调函数交由客户业务逻辑处理
     */
    function handler(e) {
      const { type, payload } = JSON.parse(e.data);
      //如果有成功回调返回调用
      if (onMessage) {
        onMessage({ type, payload });
      }
      //遍历现有消息集合|修改当前消息数据状态
      messageHandlers.forEach(handler => {
        handler({ type, payload });
      });
    }
    socket = new sockjs(url);
    socket.onopen = () => {
      resolve(socket);
    };
    socket.onmessage = handler;
    socket.onclose = e => {
      socket = null;
      if (onError) {
        onError(e);
      }
    };
  });
}

/**
 * 发送socket消息给服务端
 * @param {*} action 
 */
export function socketCallSend(action) {
  return new Promise((resolve, reject) => {
    /**
     * 当服务器返回异步消息时、消息集合遍历执行方法
     * 对比服务端返回消息类型和发送消息类型
     * 返回Promise可异步和同步执行
     * @param {*} param0 
     */
    function handler({ type, payload }) {
      if (type === `${action.type}/success`) {
        removeHandler();
        resolve(payload);
      }
      if (type === `${action.type}/failure`) {
        removeHandler();
        reject(payload);
      }
      if (type === `${action.type}/progress` && action.onProgress) {
        action.onProgress(payload);
      }
    }
    //删除当前已经返回状态的消息
    function removeHandler() {
      for (const [i, h] of messageHandlers.entries()) {
        if (h === handler) {
          messageHandlers.splice(i, 1);
          break;
        }
      }
    }
    //加入消息集合 做异步数据处理
    messageHandlers.push(handler);
    //发送数据给服务端
    socket.send(
      JSON.stringify({
        ...action,
      }),
    );
  });
}