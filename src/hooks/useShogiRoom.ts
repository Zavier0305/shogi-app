'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { supabase } from '@/lib/supabaseClient';

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
  const channelRef = useRef<any>(null);
  const bcRef = useRef<BroadcastChannel | null>(null);

  // 1. クライアントIDの初期化
  useEffect(() => {
    let id = sessionStorage.getItem('shogi-client-id');
    if (!id) {
      id = uuidv4();
      sessionStorage.setItem('shogi-client-id', id);
    }
    setClientId(id);
  }, []);

  const updateStateAndDetermineRole = useCallback((state: RoomState, cid: string) => {
    setRoomState(state);
    if (!state.senteId || state.senteId === cid) {
      setRole('sente');
    } else if (!state.goteId || state.goteId === cid) {
      setRole('gote');
    } else {
      setRole('spectator');
    }
  }, []);

  // 状態の送信を行う関数
  const broadcastState = useCallback((newState: Partial<RoomState>) => {
    if (!clientId) return;
    
    setRoomState((prev) => {
      const merged: RoomState = {
        kif: newState.kif ?? prev?.kif ?? '',
        senteId: newState.senteId !== undefined ? newState.senteId : (prev?.senteId || clientId),
        goteId: newState.goteId !== undefined ? newState.goteId : (prev?.goteId || (prev?.senteId !== clientId ? clientId : '')),
        timestamp: Date.now(),
      };
      
      if (supabase && channelRef.current) {
        channelRef.current.send({
          type: 'broadcast',
          event: 'sync_state',
          payload: merged,
        });
      } else if (bcRef.current) {
        bcRef.current.postMessage({ type: 'sync_state', payload: merged });
      }
      
      updateStateAndDetermineRole(merged, clientId);
      return merged;
    });
  }, [clientId, updateStateAndDetermineRole]);

  // プロパティ初期化同期・Channel監視
  useEffect(() => {
    if (!clientId) return;

    if (supabase) {
      // Supabase Broadcastを使用
      const channel = supabase.channel(`room:${roomId}`, {
        config: { broadcast: { self: false } },
      });
      channelRef.current = channel;

      channel.on('broadcast', { event: 'sync_state' }, ({ payload }) => {
        if (payload.timestamp > (roomState?.timestamp || 0)) {
          updateStateAndDetermineRole(payload as RoomState, clientId);
        }
      });
      channel.on('broadcast', { event: 'request_state' }, () => {
        // もし自分が先手で状態を持っていれば、相手に送る
        if (role === 'sente' && roomState) {
          channel.send({ type: 'broadcast', event: 'sync_state', payload: roomState });
        }
      });

      channel.subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          // 入室時に状態を他クライアントへリクエスト
          channel.send({ type: 'broadcast', event: 'request_state', payload: {} });
          // すぐに返事が来なければ自分が先手として初期化
          setTimeout(() => {
             setRoomState((prev) => {
                if (!prev) {
                  const init: RoomState = { kif: '', senteId: clientId, goteId: '', timestamp: Date.now() };
                  updateStateAndDetermineRole(init, clientId);
                  return init;
                }
                return prev;
             });
          }, 1000);
        }
      });

      return () => {
        supabase.removeChannel(channel);
      };
    } else {
      // フォールバック: BroadcastChannel (同一ブラウザの別タブ同期用)
      const bc = new BroadcastChannel(`shogi-room-${roomId}`);
      bcRef.current = bc;

      bc.onmessage = (event) => {
        const { type, payload } = event.data;
        if (type === 'sync_state') {
          setRoomState((prev) => {
            if (payload.timestamp > (prev?.timestamp || 0)) {
              updateStateAndDetermineRole(payload, clientId);
              return payload;
            }
            return prev;
          });
        } else if (type === 'request_state') {
          // 状態のリクエストを受け取ったら返送
          setRoomState((prev) => {
            if (prev) bc.postMessage({ type: 'sync_state', payload: prev });
            return prev;
          });
        }
      };

      // 入室リクエスト
      bc.postMessage({ type: 'request_state' });
      const timer = setTimeout(() => {
        setRoomState((prev) => {
          if (!prev) {
            const init: RoomState = { kif: '', senteId: clientId, goteId: '', timestamp: Date.now() };
            updateStateAndDetermineRole(init, clientId);
            return init;
          }
          return prev;
        });
      }, 500);

      return () => {
         clearTimeout(timer);
         bc.close();
      };
    }
  }, [roomId, clientId, role]);

  // 新規手の送信
  const pushMove = useCallback((kif: string) => {
    broadcastState({ kif });
  }, [broadcastState]);
  
  // 投了・リセット
  const resetRoom = useCallback(() => {
    broadcastState({ kif: '', timestamp: Date.now() });
  }, [broadcastState]);

  return { roomState, role, clientId, pushMove, resetRoom };
}
