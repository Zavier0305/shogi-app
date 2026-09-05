import { NextRequest, NextResponse } from 'next/server';
import { pusherServer } from '@/lib/pusher';

// このエンドポイントは認証なしで叩けるため、roomIdの形式とeventの種類を
// ここでも検証しないと、他人の対局部屋に任意のroomIdを当てずっぽうで指定して
// 偽のgame_over等を送りつけられてしまう(部屋IDが分かれば誰でも参加できる
// 設計自体は許容しているが、参加すらせず荒らせるのは別問題のため)
const ALLOWED_EVENTS = new Set([
  'sync_state',
  'request_state',
  'propose_resign',
  'accept_resign',
  'reject_resign',
  'game_over',
]);

export async function POST(req: NextRequest) {
  try {
    const { roomId, event, payload } = await req.json();

    if (!roomId || !event || !payload) {
      return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
    }
    if (!/^\d{6}$/.test(roomId)) {
      return NextResponse.json({ error: 'Invalid roomId' }, { status: 400 });
    }
    if (!ALLOWED_EVENTS.has(event)) {
      return NextResponse.json({ error: 'Invalid event' }, { status: 400 });
    }

    // Pusherを通じて他のクライアントにイベントを送信
    await pusherServer.trigger(`presence-room-${roomId}`, event, payload);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Pusher Trigger Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
