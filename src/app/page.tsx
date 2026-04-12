'use client';

import { useTransition } from 'react';
import { randomMatchAction, createRoomAction, joinRoomAction } from './actions';
import LoadingOverlay from '@/components/LoadingOverlay';

export default function Home() {
  const [isPending, startTransition] = useTransition();

  const handleRandomMatch = () => {
    startTransition(async () => {
      await randomMatchAction();
    });
  };

  const handleCreateRoom = () => {
    startTransition(async () => {
      await createRoomAction();
    });
  };

  const handleJoinRoom = (formData: FormData) => {
    startTransition(async () => {
      await joinRoomAction(formData);
    });
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 text-[#333] bg-[#faf8f5]">
      {isPending && <LoadingOverlay />}
      
      <div className="max-w-sm w-full bg-white p-8 sm:p-10 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] border border-stone-100/50 rounded-sm">
        <div className="flex flex-col items-center mb-10">
          <h1 className="text-2xl tracking-[0.4em] text-[#7a0000] font-bold mb-3 mr-[-0.4em]">
            わけあって、将棋。
          </h1>
          <div className="w-12 h-px bg-[#7a0000] mb-3 opacity-30"></div>
          <p className="text-stone-500 text-[10px] tracking-[0.2em] text-center leading-relaxed">
            シンプルで、心地よい<br/>オンライン対局。
          </p>
        </div>

        <div className="space-y-6">
          <button 
            disabled={isPending}
            onClick={handleRandomMatch}
            className="w-full bg-[#7a0000] hover:bg-[#660000] text-white py-4 px-6 transition-all duration-300 tracking-[0.2em] text-sm shadow-[0_4px_12px_rgba(122,0,0,0.2)] font-bold active:scale-[0.98] rounded-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            ランダムマッチング
          </button>

          <div className="flex items-center gap-4 py-2">
            <div className="flex-1 h-px bg-stone-100"></div>
            <span className="text-[10px] text-stone-300 tracking-widest uppercase">or</span>
            <div className="flex-1 h-px bg-stone-100"></div>
          </div>

          <button 
            disabled={isPending}
            onClick={handleCreateRoom}
            className="w-full bg-white hover:bg-stone-50 border border-stone-200 text-stone-600 py-3.5 px-6 transition duration-300 tracking-[0.2em] text-sm rounded-sm disabled:opacity-50"
          >
            合言葉で新しく作る
          </button>

          <form action={handleJoinRoom} className="space-y-3 pt-2">
            <div>
              <input 
                type="text" 
                name="roomId"
                placeholder="ルームID (6桁)" 
                maxLength={6}
                pattern="\d{6}"
                required
                disabled={isPending}
                className="w-full bg-stone-50/50 border border-stone-200 focus:border-[#7a0000] focus:bg-white focus:ring-0 px-4 py-3 text-center tracking-[0.2em] text-[#333] placeholder-stone-400 outline-none transition rounded-sm disabled:opacity-50"
              />
            </div>
            <button 
              type="submit"
              disabled={isPending}
              className="w-full bg-stone-800 hover:bg-black text-white py-3.5 px-6 transition duration-300 tracking-[0.2em] text-sm rounded-sm disabled:opacity-50"
            >
              参加する
            </button>
          </form>
        </div>
      </div>
      
      {/* Footer Links */}
      <footer className="mt-12 flex flex-col items-center gap-4">
        <div className="flex gap-4 text-[10px] tracking-widest text-stone-400">
          <a href="/terms" className="hover:text-stone-600 transition underline underline-offset-4 decoration-stone-200">利用規約</a>
          <a href="/privacy" className="hover:text-stone-600 transition underline underline-offset-4 decoration-stone-200">プライバシー</a>
          <a href="/release-notes" className="hover:text-stone-600 transition underline underline-offset-4 decoration-stone-200">リリノ</a>
        </div>
        <p className="text-stone-400 text-[9px] tracking-[0.3em] opacity-40 uppercase">Wakeatte Shogi</p>
      </footer>
    </main>
  );
}
