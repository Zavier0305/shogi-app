'use client';

import React from 'react';
import Link from 'next/link';
import { Trophy, Home, ZoomIn } from 'lucide-react';

interface GameResultModalProps {
  winner: 'sente' | 'gote' | null;
  reason: '詰み' | '投了' | 'その他';
  onClose: () => void;
}

export default function GameResultModal({ winner, reason, onClose }: GameResultModalProps) {
  if (!winner) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-[2px] animate-in fade-in duration-500">
      <div className="bg-white w-full max-w-sm rounded-sm shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)] border border-stone-100 overflow-hidden animate-in zoom-in-95 duration-300">
        {/* Header Decor */}
        <div className="h-1.5 bg-[#7a0000] w-full" />
        
        <div className="p-8 sm:p-10 flex flex-col items-center">
          <div className="w-16 h-16 bg-stone-50 rounded-full flex items-center justify-center mb-6 border border-stone-100">
            <Trophy className="w-8 h-8 text-[#7a0000] opacity-80" />
          </div>
          
          <h2 className="text-stone-400 text-[10px] tracking-[0.4em] uppercase mb-2">対局終了</h2>
          
          <div className="flex flex-col items-center mb-10">
            <span className="text-2xl font-bold text-stone-800 tracking-[0.1em] mb-2">
              {winner === 'sente' ? '先手' : '後手'}の勝ち
            </span>
            <div className="flex items-center gap-2">
              <div className="h-px w-4 bg-stone-200" />
              <span className="text-xs text-[#7a0000] font-medium tracking-widest">{reason}</span>
              <div className="h-px w-4 bg-stone-200" />
            </div>
          </div>

          <div className="w-full space-y-3">
            <Link 
              href="/"
              className="flex items-center justify-center gap-3 w-full bg-[#7a0000] hover:bg-[#660000] text-white py-3.5 rounded-sm transition-all duration-300 text-xs font-bold tracking-[0.2em] shadow-[0_4px_12px_rgba(122,0,0,0.15)] active:scale-[0.98]"
            >
              <Home className="w-4 h-4" />
              タイトルに戻る
            </Link>
            
            <button 
              onClick={onClose}
              className="flex items-center justify-center gap-3 w-full bg-white hover:bg-stone-50 text-stone-500 border border-stone-200 py-3.5 rounded-sm transition-all duration-300 text-xs tracking-[0.2em] active:scale-[0.98]"
            >
              <ZoomIn className="w-4 h-4" />
              終局図を見る
            </button>
          </div>
        </div>
        
        <div className="bg-stone-50 py-3 flex justify-center border-t border-stone-50">
          <p className="text-[9px] text-stone-300 tracking-[0.3em] uppercase">Wakeatte Shogi V1.20</p>
        </div>
      </div>
    </div>
  );
}
