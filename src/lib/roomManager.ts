import { pusherServer } from './pusher';

export async function findRandomRoom() {
  try {
    // 1. アクティブなチャンネル一覧を取得 (人数情報込)
    // 注意: PusherのこのAPIは数秒のラグがある場合があります
    const response = await pusherServer.get({
      path: '/channels',
      params: {
        filter_by_prefix: 'presence-room-',
        info: 'user_count'
      }
    });

    if (response.status === 200) {
      const result = await response.json();
      const channels = result.channels || {};

      // 2. 1人だけ待機しているチャンネルを探す
      const waitingRooms = Object.keys(channels).filter(id => channels[id].user_count === 1);

      if (waitingRooms.length > 0) {
        // 最も古い（またはランダムな）待機部屋を返す
        // prefix 'presence-room-' を除いてIDを取得
        const channelName = waitingRooms[0];
        return channelName.replace('presence-room-', '');
      }
    }
  } catch (error) {
    console.error("Pusher matching error:", error);
  }

  // 3. 待機部屋がなければ新しくIDを発行して返す (遷移後にその部屋がアクティブになる)
  return Math.floor(100000 + Math.random() * 900000).toString();
}
