'use server';

import { redirect } from 'next/navigation';
import { findRandomRoom } from '@/lib/roomManager';

export async function randomMatchAction() {
  const roomId = await findRandomRoom();
  if (roomId) {
    redirect(`/room/${roomId}`);
  }
}

export async function createRoomAction() {
  const roomId = Math.floor(100000 + Math.random() * 900000).toString();
  redirect(`/room/${roomId}`);
}

export async function joinRoomAction(formData: FormData) {
  const roomId = formData.get('roomId') as string;
  // クライアント側のpattern="\d{6}"はJS無効化やフォーム直接送信で回避できるため、
  // サーバー側でも同じ条件(6桁の数字のみ)を検証する
  if (roomId && /^\d{6}$/.test(roomId)) {
    redirect(`/room/${roomId}`);
  }
}
