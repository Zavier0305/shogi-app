'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import Pusher from 'pusher-js';

// ハードコードされたPusher鍵 (確実に動作させるため)
const PUSHER_KEY = "8e3a1eb5fc73e7db907f";
const PUSHER_CLUSTER = "ap3";

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
  const [resignProposedBy, setResignProposedBy] = useState<string | null>(null);
  const [gameResult, setGameResult] = useState<{ winner: 'sente' | 'gote'; reason: '詰み' | '投了' } | null>(null);
  const [opponentLeft, setOpponentLeft] = useState<boolean>(false);
  const pusherRef = useRef<Pusher | null>(null);
  const roomStateRef = useRef<RoomState | null>(null);
  const roleRef = useRef<'sente' | 'gote' | 'spectator'>('spectator');

  useEffect(() => {
    roomStateRef.current = roomState;
  }, [roomState]);

  useEffect(() => {
    roleRef.current = role;
  }, [role]);

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
    return null; // まだ割り当てられていない
  }, []);

  // サーバー側のAPIを叩いて配信
  const emitState = useCallback(async (state: RoomState | {}, event: string = 'sync_state', extraPayload?: any) => {
    try {
      await fetch('/api/pusher', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ roomId, event, payload: extraPayload || state }),
      });
    } catch (err) {
      console.error('Failed to emit state:', err);
    }
  }, [roomId]);

  // 状態更新と自動ロール割り当て
  const handleStateUpdate = useCallback((receivedState: RoomState, cid: string) => {
    const current = roomStateRef.current;
    
    // 自分ですでに進めた状態（タイムスタンプが新しい）がある場合は、古い更新を無視
    if (current && receivedState.timestamp < current.timestamp) return;

    let nextState = { ...receivedState };
    const myExistingRole = determineRole(nextState, cid);
    
    // すでに役割が決まっている（または観戦でない）状態から、観戦に戻るのを防ぐ
    setRole(prev => {
      if (myExistingRole) return myExistingRole;
      
      // まだ役割が決まっていない場合、空きがあれば入る
      if (prev === 'spectator') {
        if (!nextState.senteId) {
          nextState.senteId = cid;
          nextState.timestamp = Date.now();
          emitState(nextState);
          return 'sente';
        } else if (!nextState.goteId && nextState.senteId !== cid) {
          nextState.goteId = cid;
          nextState.timestamp = Date.now();
          emitState(nextState);
          return 'gote';
        }
      }
      return prev;
    });
    
    setRoomState(nextState);
  }, [determineRole, emitState]); // roleを依存関係から外し、setRoleの関数型更新を使用関数型更新を使用するように変更

  useEffect(() => {
    if (!clientId) return;

    // Pusher クライアント初期化
    const pusher = new Pusher(PUSHER_KEY, {
      cluster: PUSHER_CLUSTER,
      authEndpoint: '/api/pusher/auth',
      auth: {
        params: { user_id: clientId }
      }
    });
    pusherRef.current = pusher;

    const channelName = `presence-room-${roomId}`;
    const channel = pusher.subscribe(channelName);
    
    channel.bind('sync_state', (data: RoomState) => {
      handleStateUpdate(data, clientId);
    });

    channel.bind('request_state', () => {
      if (roomStateRef.current) emitState(roomStateRef.current);
    });

    channel.bind('propose_resign', (data: { proposedBy: string }) => {
      setResignProposedBy(data.proposedBy);
    });

    channel.bind('accept_resign', () => {
      setResignProposedBy(null);
    });

    channel.bind('reject_resign', () => {
      setResignProposedBy(null);
      alert('投了/引き分けの提案が拒否されました。');
    });

    channel.bind('game_over', (data: { winner: 'sente' | 'gote'; reason: '詰み' | '投了' }) => {
      setGameResult(data);
    });

    channel.bind('pusher:subscription_succeeded', (members: any) => {
      // 接続時に現在の状態をリクエスト
      emitState({} as RoomState, 'request_state');
      
      // 自分が最初の1人目なら、即座に先手として初期化
      if (members.count === 1) {
        const init: RoomState = { kif: '', senteId: clientId, goteId: '', timestamp: Date.now() };
        setRoomState(init);
        setRole('sente');
        emitState(init);
      }
    });

    channel.bind('pusher:member_added', (member: any) => {
       const current = roomStateRef.current;
       // 自分が先手で、新しく誰か入ってきたがまだ後手が決まっていない場合
       if (current && current.senteId === clientId && !current.goteId) {
         emitState(current); // 現在の状態を再送して、相手に先手がいることを知らせる
       }
       // 相手が戻ってきた場合はフラグを折る
       setOpponentLeft(false);
    });

    channel.bind('pusher:member_removed', (member: any) => {
       // シンプルに「自分以外の誰かがいなくなった」かつ「今は自分一人だけ（かつ観戦者でない）」なら相手が消えたとみなす
       // PresenceChannelとして扱うためにキャスト
       const presenceChannel = channel as any;
       if (presenceChannel.members && presenceChannel.members.count === 1 && roleRef.current !== 'spectator') {
         setOpponentLeft(true);
       }
    });

    return () => {
      pusher.unsubscribe(channelName);
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

  const proposeResign = useCallback(() => {
    emitState({}, 'propose_resign', { proposedBy: clientId });
  }, [clientId, emitState]);

  const replyResign = useCallback((accept: boolean) => {
    if (accept) {
      // 投了した側の反対が勝者
      const winner = resignProposedBy === roomStateRef.current?.senteId ? 'gote' : 'sente';
      emitState({}, 'game_over', { winner, reason: '投了' });
      setGameResult({ winner, reason: '投了' });
    } else {
      emitState({}, 'reject_resign', {});
    }
    setResignProposedBy(null);
  }, [emitState, resignProposedBy]);

  const notifyGameOver = useCallback((winner: 'sente' | 'gote', reason: '詰み' | '投了') => {
    emitState({}, 'game_over', { winner, reason });
    setGameResult({ winner, reason });
  }, [emitState]);

  return { roomState, role, clientId, pushMove, resetRoom, resignProposedBy, proposeResign, replyResign, gameResult, notifyGameOver, opponentLeft };
}
