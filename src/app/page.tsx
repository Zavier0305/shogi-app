'use client';

import { useTransition } from 'react';
import Link from 'next/link';
import { randomMatchAction, createRoomAction, joinRoomAction } from './actions';
import LoadingOverlay from '@/components/LoadingOverlay';
import TutorialGuide from '@/components/TutorialGuide';

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
    <main className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 text-[var(--ink)]">
      {isPending && <LoadingOverlay />}
      <TutorialGuide />

      <div className="meishi-card meishi-fade-in max-w-sm w-full p-8 sm:p-10 shadow-[0_20px_60px_-15px_rgba(43,36,32,0.12)]">
        <div className="flex flex-col items-center mb-10">
          <h1 className="text-2xl tracking-[0.4em] text-[var(--maroon)] font-extrabold mb-3 mr-[-0.4em]">
            わけあって、将棋。
          </h1>
          <div className="w-12 h-px bg-[var(--gold-soft)] mb-3 opacity-70"></div>
          <p className="text-[var(--ink-soft)] text-[10px] tracking-[0.2em] text-center leading-relaxed">
            シンプルで、心地よい<br/>オンライン対局。
          </p>
        </div>

        <div className="space-y-6">
          <button
            disabled={isPending}
            onClick={handleRandomMatch}
            className="btn-pill-primary w-full py-4 px-6 tracking-[0.2em] text-sm font-bold active:scale-[0.98]"
          >
            ランダムマッチング
          </button>

          <div className="flex items-center gap-4 py-2">
            <div className="flex-1 h-px bg-[var(--border)]"></div>
            <span className="text-[10px] text-[var(--ink-faint)] tracking-widest uppercase">or</span>
            <div className="flex-1 h-px bg-[var(--border)]"></div>
          </div>

          <button
            disabled={isPending}
            onClick={handleCreateRoom}
            className="btn-pill w-full py-3.5 px-6 tracking-[0.2em] text-sm"
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
                className="w-full bg-[var(--surface)] border border-[var(--border)] focus:border-[var(--maroon)] focus:ring-0 px-4 py-3 text-center tracking-[0.2em] text-[var(--ink)] placeholder-[var(--ink-faint)] outline-none transition rounded-full disabled:opacity-50"
              />
            </div>
            <button
              type="submit"
              disabled={isPending}
              className="btn-pill w-full py-3.5 px-6 tracking-[0.2em] text-sm"
            >
              参加する
            </button>
          </form>
        </div>
      </div>

      {/* Footer Links */}
      <footer className="mt-12 flex flex-col items-center gap-4">
        <div className="flex gap-4 text-[10px] tracking-widest text-[var(--ink-faint)]">
          <Link href="/terms" className="hover:text-[var(--maroon)] transition underline underline-offset-4 decoration-[var(--border)]">利用規約</Link>
          <Link href="/privacy" className="hover:text-[var(--maroon)] transition underline underline-offset-4 decoration-[var(--border)]">プライバシー</Link>
          <Link href="/release-notes" className="hover:text-[var(--maroon)] transition underline underline-offset-4 decoration-[var(--border)]">リリノ</Link>
        </div>
        <p className="text-[var(--ink-faint)] text-[9px] tracking-[0.3em] opacity-60 uppercase">Wakeatte Shogi</p>
      </footer>
    </main>
  );
}
