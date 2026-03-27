'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import Pusher from 'pusher-js';

export type RoomState = {
  kif: string;        // shogi.jsのKIF状態
  senteId: string;    // 先手のUUID
  goteId: string;     // 後手のUUID
  timestamp: number;  // 最新更新時刻
};

export function useShogiRoom(roomId: string) {
  const [clientId, setClientId] = useState<string>('');
  const [roomState, setRoomState] = useState<RoomState | null>(null);
  const [role, setRole] = useState<'sente' | 'gote' | 'spectator'>('spectator');
  const pusherRef = useRef<Pusher | null>(null);
  const roomStateRef = useRef<RoomState | null>(null);

  useEffect(() => {
    roomStateRef.current = roomState;
  }, [roomState]);

  // クライアントIDの初期化
  useEffect(() => {
    let id = sessionStorage.getItem('shogi-client-id');
    if (!id) {
      id = uuidv4();
      sessionStorage.setItem('shogi-client-id', id);
    }
    setClientId(id);
  }, []);

  // ロールの判定
  const determineRole = useCallback((state: RoomState, cid: string) => {
    if (state.senteId === cid) return 'sente';
    if (state.goteId === cid) return 'gote';
    if (!state.senteId) return 'sente';
    if (!state.goteId) return 'gote';
    return 'spectator';
  }, []);

  // サーバー側のAPIを叩いて状態を配信する関数
  const emitState = useCallback(async (state: RoomState, event: string = 'sync_state') => {
    try {
      await fetch('/api/pusher', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ roomId, event, payload: state }),
      });
    } catch (err) {
      console.error('Failed to emit state:', err);
    }
  }, [roomId]);

  // 状態更新と必要に応じた自動ロール割り当て
  const handleStateUpdate = useCallback((receivedState: RoomState, cid: string) => {
    const current = roomStateRef.current;
    if (current && receivedState.timestamp <= current.timestamp) return;

    let nextState = { ...receivedState };
    const myRole = determineRole(nextState, cid);
    setRole(myRole);

    let needsBroadcast = false;
    if (myRole === 'sente' && !nextState.senteId) {
      nextState.senteId = cid;
      needsBroadcast = true;
    } else if (myRole === 'gote' && !nextState.goteId) {
      nextState.goteId = cid;
      needsBroadcast = true;
    }

    if (needsBroadcast) {
      nextState.timestamp = Date.now();
      emitState(nextState);
    }
    setRoomState(nextState);
  }, [determineRole, emitState]);

  useEffect(() => {
    const pusherKey = process.env.NEXT_PUBLIC_PUSHER_KEY;
    const pusherCluster = process.env.NEXT_PUBLIC_PUSHER_CLUSTER;

    if (!clientId || !pusherKey || !pusherCluster) return;

    // Pusher クライアント初期化
    const pusher = new Pusher(pusherKey, {
      cluster: pusherCluster,
    });
    pusherRef.current = pusher;

    const channel = pusher.subscribe(`room-${roomId}`);
    
    // イベント受信設定
    channel.bind('sync_state', (data: RoomState) => {
      handleStateUpdate(data, clientId);
    });

    channel.bind('request_state', () => {
      if (roomStateRef.current) {
        emitState(roomStateRef.current);
      }
    });

    // 接続成功時に自分の存在をアピール
    const timer = setTimeout(() => {
      emitState({} as RoomState, 'request_state');
      
      // 1.5秒待っても誰もいなければ自分が先手
      setTimeout(() => {
        if (!roomStateRef.current) {
          const init: RoomState = { kif: '', senteId: clientId, goteId: '', timestamp: Date.now() };
          setRoomState(init);
          setRole('sente');
          emitState(init);
        }
      }, 1500);
    }, 500);

    return () => {
      clearTimeout(timer);
      pusher.unsubscribe(`room-${roomId}`);
      pusher.disconnect();
    };
  }, [roomId, clientId, emitState, handleStateUpdate]);

  const pushMove = useCallback((kif: string) => {
    const current = roomStateRef.current;
    if (!current || !clientId) return;
    const next: RoomState = { ...current, kif, timestamp: Date.now() };
    setRoomState(next);
    emitState(next);
  }, [clientId, emitState]);
  
  const resetRoom = useCallback(() => {
    const current = roomStateRef.current;
    if (!current || !clientId) return;
    const next: RoomState = { ...current, kif: '', timestamp: Date.now() };
    setRoomState(next);
    emitState(next);
  }, [clientId, emitState]);

  return { roomState, role, clientId, pushMove, resetRoom };
}
