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
  if (roomId && roomId.length === 6) {
    redirect(`/room/${roomId}`);
  }
}
