'use client';

import React from 'react';
import Link from 'next/link';
import { Trophy, Home, ZoomIn, RotateCcw } from 'lucide-react';

interface GameResultModalProps {
  winner: 'sente' | 'gote' | null;
  reason: '詰み' | '投了' | 'その他';
  onClose: () => void;
  onRematch?: () => void;
}

export default function GameResultModal({ winner, reason, onClose, onRematch }: GameResultModalProps) {
  if (!winner) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-[2px] animate-in fade-in duration-500">
      <div className="meishi-card meishi-fade-in w-full max-w-sm shadow-[0_25px_50px_-12px_rgba(43,36,32,0.3)] overflow-hidden">
        {/* Header Decor */}
        <div className="h-1.5 bg-[var(--maroon)] w-full" />

        <div className="p-8 sm:p-10 flex flex-col items-center">
          <div className="w-16 h-16 bg-[var(--bg)] rounded-full flex items-center justify-center mb-6 border border-[var(--border)]">
            <Trophy className="w-8 h-8 text-[var(--maroon)] opacity-80" />
          </div>

          <h2 className="text-[var(--ink-faint)] text-[10px] tracking-[0.4em] uppercase mb-2">対局終了</h2>

          <div className="flex flex-col items-center mb-10">
            <span className="[font-family:var(--font-heading)] text-2xl font-bold text-[var(--ink)] tracking-[0.1em] mb-2">
              {winner === 'sente' ? '先手' : '後手'}の勝ち
            </span>
            <div className="flex items-center gap-2">
              <div className="h-px w-4 bg-[var(--gold-soft)]" />
              <span className="text-xs text-[var(--maroon)] font-medium tracking-widest">{reason}</span>
              <div className="h-px w-4 bg-[var(--gold-soft)]" />
            </div>
          </div>

          <div className="w-full space-y-3">
            {onRematch && (
              <button
                onClick={onRematch}
                className="btn-pill-primary flex items-center justify-center gap-3 w-full py-3.5 text-xs font-bold tracking-[0.2em] active:scale-[0.98]"
              >
                <RotateCcw className="w-4 h-4" />
                もう一度対局する
              </button>
            )}

            <Link
              href="/"
              className={
                onRematch
                  ? "btn-pill flex items-center justify-center gap-3 w-full py-3.5 text-xs tracking-[0.2em] active:scale-[0.98]"
                  : "btn-pill-primary flex items-center justify-center gap-3 w-full py-3.5 text-xs font-bold tracking-[0.2em] active:scale-[0.98]"
              }
            >
              <Home className="w-4 h-4" />
              タイトルに戻る
            </Link>

            <button
              onClick={onClose}
              className="btn-pill flex items-center justify-center gap-3 w-full py-3.5 text-xs tracking-[0.2em] active:scale-[0.98]"
            >
              <ZoomIn className="w-4 h-4" />
              終局図を見る
            </button>
          </div>
        </div>

        <div className="bg-[var(--bg)] py-3 flex justify-center border-t border-[var(--border)]">
          <p className="text-[9px] text-[var(--ink-faint)] tracking-[0.3em] uppercase">Wakeatte Shogi V1.20</p>
        </div>
      </div>
    </div>
  );
}
