import { NextRequest, NextResponse } from 'next/server';
import { pusherServer } from '@/lib/pusher';

export async function POST(req: NextRequest) {
  try {
    const { roomId, event, payload } = await req.json();

    if (!roomId || !event || !payload) {
      return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
    }

    // Pusherを通じて他のクライアントにイベントを送信
    await pusherServer.trigger(`presence-room-${roomId}`, event, payload);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Pusher Trigger Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
