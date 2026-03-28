'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useShogiRoom } from '@/hooks/useShogiRoom';
import { Shogi, Kind, Color as SColor } from 'shogi.js';
import { ClipboardCopy, LogOut } from 'lucide-react';
import clsx from 'clsx';

const KIND_KANJI: Record<string, string> = {
  FU: '歩', KY: '香', KE: '桂', GI: '銀', KI: '金', KA: '角', HI: '飛', OU: '王',
  TO: 'と', NY: '杏', NK: '圭', NG: '全', UM: '馬', RY: '龍',
};

const PROMOTABLE: Record<string, string> = {
  FU: 'TO', KY: 'NY', KE: 'NK', GI: 'NG', KA: 'UM', HI: 'RY'
};

export default function ShogiBoard({ roomId }: { roomId: string }) {
  const { roomState, role, clientId, pushMove, resetRoom } = useShogiRoom(roomId);
  
  const [shogi] = useState(() => {
    const s = new Shogi();
    s.initialize();
    return s;
  });

  const [boardVersion, setBoardVersion] = useState(0);
  const [selectedPos, setSelectedPos] = useState<{x: number, y: number} | null>(null);
  const [selectedHand, setSelectedHand] = useState<{color: SColor, kind: string} | null>(null);
  
  const [promotionPrompt, setPromotionPrompt] = useState<{
    from: {x: number, y: number},
    to: {x: number, y: number},
    originalKind: string
  } | null>(null);

  useEffect(() => {
    if (roomState?.kif) {
      try {
        shogi.initializeFromSFENString(roomState.kif);
      } catch (e) {
        console.error("SFEN parse error, resetting...", e);
        shogi.initialize();
      }
    } else {
      shogi.initialize();
    }
    setBoardVersion(v => v + 1);
    setSelectedPos(null);
    setSelectedHand(null);
  }, [roomState?.kif, shogi]);

  const isMyTurn = useMemo(() => {
    if (role === 'spectator') return false;
    const currentTurn = shogi.turn; 
    if (role === 'sente' && currentTurn === SColor.Black) return true;
    if (role === 'gote' && currentTurn === SColor.White) return true;
    return false;
  }, [role, shogi.turn, boardVersion]);

  const commitLocalMove = useCallback(() => {
    const sfen = shogi.toSFENString();
    pushMove(sfen);
    setBoardVersion(v => v + 1);
  }, [shogi, pushMove]);

  const handleSquareClick = (x: number, y: number) => {
    if (!isMyTurn) return;

    if (selectedHand) {
      if (!shogi.get(x, y)) {
        try {
          shogi.drop(x, y, selectedHand.kind as any, selectedHand.color);
          commitLocalMove();
        } catch (e) {
          console.error("Invalid drop");
        }
      }
      setSelectedHand(null);
      return;
    }

    if (selectedPos) {
      if (selectedPos.x === x && selectedPos.y === y) {
        setSelectedPos(null);
        return;
      }

      const piece = shogi.get(selectedPos.x, selectedPos.y);
      if (piece) {
        const pColor = piece.color;
        const pKind = piece.kind;
        
        const isEnemyZone = pColor === SColor.Black 
          ? (y <= 3 || selectedPos.y <= 3)
          : (y >= 7 || selectedPos.y >= 7);

        const canPromote = PROMOTABLE[pKind] && isEnemyZone;
        const moves = shogi.getMovesFrom(selectedPos.x, selectedPos.y);
        const validMove = moves.find(m => m.to.x === x && m.to.y === y);

        if (validMove) {
          if (canPromote) {
            setPromotionPrompt({
              from: selectedPos,
              to: {x, y},
              originalKind: pKind
            });
            setSelectedPos(null);
            return;
          } else {
            try {
              shogi.move(selectedPos.x, selectedPos.y, x, y, false);
              commitLocalMove();
            } catch (e) {
              console.error("Invalid move", e);
            }
          }
        }
      }
      const newTarget = shogi.get(x, y);
      if (newTarget && newTarget.color === shogi.turn) {
        setSelectedPos({x, y});
      } else {
        setSelectedPos(null);
      }
      return;
    }

    const p = shogi.get(x, y);
    if (p && p.color === shogi.turn) {
      setSelectedPos({x, y});
    }
  };

  const handlePromotionSelect = (promote: boolean) => {
    if (!promotionPrompt) return;
    try {
      shogi.move(
        promotionPrompt.from.x, 
        promotionPrompt.from.y, 
        promotionPrompt.to.x, 
        promotionPrompt.to.y, 
        promote
      );
      commitLocalMove();
    } catch(e) {
      console.error(e);
    }
    setPromotionPrompt(null);
  };

  const handleHandClick = (color: SColor, kind: string) => {
    if (!isMyTurn) return;
    if (shogi.turn !== color) return;
    setSelectedHand({ color, kind });
    setSelectedPos(null);
  };

  const copyUrl = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    alert('対局室のURLをコピーしました。');
  };

  const rows = [1,2,3,4,5,6,7,8,9];
  const cols = [9,8,7,6,5,4,3,2,1];

  const renderHand = (color: SColor, isMobile: boolean = false) => {
    const handStrRaw = shogi.getHandsSummary(color as any);
    const hand = handStrRaw || {};
    const hasItems = Object.values(hand).some((c: any) => c > 0);
    
    return (
      <div className={clsx(
        "flex flex-wrap gap-1.5 sm:gap-2 p-3 sm:p-4 transition-colors",
        isMobile ? "min-h-[60px] border-x-0 sm:border-x border-y sm:rounded-sm" : "min-h-[90px] border rounded-sm",
        "bg-white border-stone-200 shadow-sm",
        (isMyTurn && shogi.turn === color) ? "ring-1 ring-[#7a0000]/30" : ""
      )}>
        <span className="text-stone-500 w-full text-[10px] sm:text-[11px] tracking-widest border-b border-stone-100 pb-1.5 sm:pb-2 mb-1.5 sm:mb-2 flex justify-between">
          <span>{role === 'sente' ? (color === SColor.Black ? '先手 / あなた' : '後手 / 相手') :
           role === 'gote' ? (color === SColor.White ? '後手 / あなた' : '先手 / 相手') :
           (color === SColor.Black ? '先手' : '後手')}</span>
          <span>持ち駒</span>
        </span>
        
        {!hasItems && (
          <div className="w-full text-center text-[10px] sm:text-xs text-stone-300 py-1 sm:py-2">駒はありません</div>
        )}

        {Object.entries(hand).map(([kind, count]: [string, any]) => {
          if (count === 0) return null;
          const isSelected = selectedHand?.color === color && selectedHand?.kind === kind;
          return (
            <div 
              key={kind}
              onClick={() => handleHandClick(color, kind)}
              className={clsx(
                "relative flex items-center justify-center min-w-[32px] sm:min-w-[36px] h-[36px] sm:h-[40px] px-1.5 sm:px-2 cursor-pointer transition-all border font-serif text-base sm:text-lg rounded-sm shadow-sm",
                "bg-[var(--color-shogi-piece)] border-stone-300 text-stone-800",
                isSelected && "bg-stone-100 ring-2 ring-stone-300 -translate-y-0.5"
              )}
            >
              <span>{KIND_KANJI[kind] || kind}</span>
              {count > 1 && (
                <span className="text-[9px] sm:text-[10px] text-stone-500 ml-0.5 sm:ml-1 font-sans">x{count}</span>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="flex flex-col xl:flex-row items-center xl:items-start justify-center gap-4 sm:gap-8 xl:gap-12 w-full max-w-full sm:max-w-7xl mx-auto pb-10">
      
      {/* モバイル用: 相手の持ち駒 (盤面の上) */}
      <div className="w-full xl:hidden px-2 max-w-[500px]">
        {renderHand(role === 'gote' ? SColor.Black : SColor.White, true)}
      </div>

      {/* 盤面領域 */}
      <div className="relative w-full sm:w-auto flex justify-center px-1 sm:px-0">
        <div className="bg-white p-2 sm:p-6 shadow-sm border border-stone-200 rounded-sm w-full sm:w-auto overflow-hidden">
          <div 
            className={clsx(
              "grid gap-[1px] bg-[var(--color-shogi-line)] border-[1px] border-[var(--color-shogi-line)] transition-transform duration-700 relative",
              role === 'gote' && "rotate-180"
            )}
            style={{ 
              gridTemplateColumns: 'repeat(9, 1fr)',
              width: 'min(calc(100vw - 12px * 2 - 8px * 2), 460px)', // スマホでのマージン考慮
              margin: '0 auto'
            }}
          >
            {rows.map(y => {
              return cols.map(x => {
                const piece = shogi.get(x, y);
                const isSelected = selectedPos?.x === x && selectedPos?.y === y;
                
                let isMovable = false;
                if (selectedPos && !selectedHand) {
                  const moves = shogi.getMovesFrom(selectedPos.x, selectedPos.y);
                  if (moves.some(m => m.to.x === x && m.to.y === y)) isMovable = true;
                }

                return (
                  <div 
                    key={`${x}-${y}`} 
                    onClick={() => handleSquareClick(x, y)}
                    className={clsx(
                      "w-full aspect-[1/1.06] bg-[var(--color-shogi-board)] hover:bg-[#dfd3bc] transition-colors flex items-center justify-center relative cursor-pointer",
                      isSelected && "bg-[#d3c5a9]",
                      isMovable && "after:content-[''] after:absolute after:w-2 after:h-2 after:bg-stone-500/30 after:rounded-full"
                    )}
                  >
                    {piece && (
                      <div className={clsx(
                        "flex items-center justify-center font-bold tracking-tighter w-[92%] h-[94%] rounded-sm",
                        "bg-[var(--color-shogi-piece)] border-b-2 border-r-[1px] border-[#d8d1c6] shadow-sm font-serif select-none",
                        piece.color === SColor.Black ? "text-stone-800" : "text-stone-800 rotate-180",
                        (piece.kind === 'TO' || piece.kind === 'NY' || piece.kind === 'NK' || piece.kind === 'NG' || piece.kind === 'UM' || piece.kind === 'RY') ? "!text-[#a32222]" : ""
                      )} style={{ fontSize: 'clamp(0.9rem, 4vw, 1.5rem)' }}>
                        {KIND_KANJI[piece.kind] || piece.kind}
                      </div>
                    )}
                  </div>
                );
              });
            })}
          </div>
        </div>

        {/* 成りダイアログ */}
        {promotionPrompt && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-[#faf8f5]/80 backdrop-blur-sm p-4 text-center">
            <div className="bg-white border border-stone-200 p-6 sm:p-8 shadow-md flex flex-col items-center rounded-sm w-full max-w-xs">
              <h3 className="text-base sm:text-lg text-stone-700 mb-6 sm:mb-8 tracking-widest">成りますか？</h3>
              <div className="flex gap-4 w-full">
                <button 
                  onClick={() => handlePromotionSelect(true)}
                  className="flex-1 px-4 py-3 bg-[#7a0000] hover:bg-[#660000] text-white tracking-[0.2em] text-sm transition"
                >
                  成る
                </button>
                <button 
                  onClick={() => handlePromotionSelect(false)}
                  className="flex-1 px-4 py-3 bg-stone-100 hover:bg-stone-200 text-stone-600 tracking-[0.2em] text-sm transition"
                >
                  成らず
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* モバイル用: 自分の持ち駒 (盤面の下) */}
      <div className="w-full xl:hidden px-2 max-w-[500px]">
        {renderHand(role === 'gote' ? SColor.White : SColor.Black, true)}
      </div>

      {/* サイドパネル（情報・操作） */}
      <div className="flex flex-col gap-4 sm:gap-6 w-full max-w-full sm:max-w-sm font-sans px-2 sm:px-0 xl:mt-0">
        <div className="bg-white border border-stone-200 p-5 sm:p-6 shadow-sm rounded-sm">
          <div className="flex justify-between items-center mb-4 sm:mb-6">
            <h2 className="text-xs sm:text-sm tracking-widest text-[#7a0000] font-bold">
              ID: {roomId}
            </h2>
            <button 
              onClick={copyUrl}
              className="text-stone-400 hover:text-stone-600 transition flex items-center gap-1 text-[10px] sm:text-xs"
              title="URLをコピー"
            >
              <ClipboardCopy className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              コピー
            </button>
          </div>
          
          <div className="flex flex-col gap-3 sm:gap-4">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <span className="text-[10px] sm:text-xs text-stone-400 tracking-wider">プレイヤー</span>
              <span className="text-xs sm:text-sm font-medium text-stone-700">
                {role === 'sente' ? '先手 ☗' : role === 'gote' ? '後手 ☖' : '観戦'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] sm:text-xs text-stone-400 tracking-wider">手番</span>
              <span className={clsx(
                "px-3 sm:px-4 py-1 sm:py-1.5 text-[10px] sm:text-xs tracking-widest rounded-sm transition-colors",
                shogi.turn === SColor.Black ? "bg-stone-800 text-white" : "bg-stone-200 text-stone-800",
                !isMyTurn && role !== 'spectator' && "opacity-60"
              )}>
                {shogi.turn === SColor.Black ? '先手の手番' : '後手の手番'}
              </span>
            </div>
          </div>
        </div>

        {/* PC用: 持ち駒表示 (XL以上のみ) */}
        <div className="hidden xl:flex flex-col gap-6">
          {role === 'gote' ? (
            <>
              {renderHand(SColor.Black)}
              {renderHand(SColor.White)}
            </>
          ) : (
            <>
              {renderHand(SColor.White)}
              {renderHand(SColor.Black)}
            </>
          )}
        </div>

        <button 
          onClick={resetRoom}
          disabled={role === 'spectator'}
          className="w-full flex items-center justify-center gap-2 py-3 sm:py-3.5 bg-white hover:bg-stone-50 border border-stone-200 text-stone-500 disabled:opacity-30 transition tracking-widest text-[10px] sm:text-xs rounded-sm mb-4"
        >
          <LogOut className="w-3 sm:w-3.5 h-3 sm:h-3.5" />
          <span>初めからやり直す (投了)</span>
        </button>
      </div>

      {/* デバッグ情報 */}
      <div className="fixed bottom-2 right-2 text-[9px] sm:text-[10px] p-1.5 sm:p-2 bg-black/50 text-white rounded opacity-40 pointer-events-none z-10">
        ID: {clientId?.slice(0, 8)} | Role: {role}
      </div>
    </div>
  );
}
