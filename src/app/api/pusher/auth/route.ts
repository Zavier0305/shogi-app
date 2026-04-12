import { NextRequest, NextResponse } from 'next/server';
import { pusherServer } from '@/lib/pusher';

export async function POST(req: NextRequest) {
  try {
    const body = await req.formData();
    const socketId = body.get('socket_id') as string;
    const channelName = body.get('channel_name') as string;
    const clientId = body.get('user_id') as string || 'anonymous';

    if (!socketId || !channelName) {
      return new NextResponse('Missing socket_id or channel_name', { status: 400 });
    }

    // プレゼンスチャンネル用のユーザーデータ
    const presenceData = {
      user_id: clientId,
      user_info: { id: clientId }
    };

    const authResponse = pusherServer.authorizeChannel(socketId, channelName, presenceData);
    return NextResponse.json(authResponse);
  } catch (error) {
    console.error('Pusher Auth Error:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
