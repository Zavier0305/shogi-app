import PusherServer from 'pusher';
import PusherClient from 'pusher-js';

// サーバーサイド用インスタンス (ハードコード設定で確実に動作)
export const pusherServer = new PusherServer({
  appId: "2133530",
  key: "8e3a1eb5fc73e7db907f",
  secret: "caa8166664de7866a576",
  cluster: "ap3",
  useTLS: true,
});

// クライアントサイド用インスタンス
let pusherClientInstance: PusherClient | null = null;

export const getPusherClient = () => {
  if (!pusherClientInstance) {
    pusherClientInstance = new PusherClient("8e3a1eb5fc73e7db907f", {
      cluster: "ap3",
    });
  }
  return pusherClientInstance;
};
