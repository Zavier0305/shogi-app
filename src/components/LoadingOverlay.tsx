'use client';

import React from 'react';

export default function LoadingOverlay() {
  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-white/90 backdrop-blur-sm transition-opacity duration-300">
      <div className="relative mb-8">
        {/* 将棋駒の形をしたアニメーション要素 */}
        <div className="w-16 h-20 bg-[#c29b4a] relative animate-shogi-wobble shadow-lg border-b-4 border-r-4 border-[#a6823d]"
             style={{
               clipPath: 'polygon(50% 0%, 100% 25%, 85% 100%, 15% 100%, 0% 25%)'
             }}>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-2xl font-bold text-[#7a0000] opacity-80 font-serif rotate-[-5deg]">歩</span>
          </div>
        </div>
        
        {/* 装飾用の影 */}
        <div className="w-12 h-2 bg-black/5 rounded-[100%] absolute -bottom-4 left-1/2 -translate-x-1/2 blur-md animate-shogi-shadow"></div>
      </div>
      
      <div className="flex flex-col items-center gap-2">
        <p className="text-stone-600 text-sm tracking-[0.4em] font-bold animate-pulse">対局相手を探しています</p>
        <div className="flex gap-1">
          <span className="w-1 h-1 bg-[#7a0000] rounded-full animate-bounce [animation-delay:-0.3s]"></span>
          <span className="w-1 h-1 bg-[#7a0000] rounded-full animate-bounce [animation-delay:-0.15s]"></span>
          <span className="w-1 h-1 bg-[#7a0000] rounded-full animate-bounce"></span>
        </div>
      </div>

      <style jsx>{`
        @keyframes shogi-wobble {
          0%, 100% { transform: rotate(-5deg) translateY(0); }
          25% { transform: rotate(5deg) translateY(-5px); }
          50% { transform: rotate(-8deg) translateY(0); }
          75% { transform: rotate(4deg) translateY(-3px); }
        }
        @keyframes shogi-shadow {
          0%, 100% { transform: translateX(-50%) scale(1); opacity: 0.2; }
          25% { transform: translateX(-50%) scale(1.1); opacity: 0.1; }
          50% { transform: translateX(-50%) scale(0.9); opacity: 0.2; }
          75% { transform: translateX(-50%) scale(1.05); opacity: 0.15; }
        }
        .animate-shogi-wobble {
          animation: shogi-wobble 0.8s ease-in-out infinite;
        }
        .animate-shogi-shadow {
          animation: shogi-shadow 0.8s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
