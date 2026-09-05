'use client';

import React, { useEffect, useState } from 'react';

const STORAGE_KEY = 'shogi_tutorial_seen';

const STEPS: { title: string; body: React.ReactNode }[] = [
  {
    title: '対局のはじめかた',
    body: (
      <>
        ホームには3つの始め方があります。「ランダムマッチング」で誰かと自動的に対局、
        「合言葉で新しく作る」で6桁のルームIDを発行して友だちに伝える、
        もらったIDを入力して「参加する」の3通りです。
        最初に入った人が先手、次に入った人が後手、それ以降は観戦になります。
      </>
    ),
  },
  {
    title: '駒の動かし方',
    body: (
      <>
        自分の駒をタップすると選択され、動かせるマスに印が付きます。
        印の付いたマスをタップすると移動します。
        持ち駒を使うときは、盤の横（またはモバイルでは上下）のトレイから駒をタップし、
        置きたい空きマスをタップしてください。
      </>
    ),
  },
  {
    title: '成り（プロモーション）',
    body: (
      <>
        歩・香・桂・銀・角・飛が敵陣に入る手を指すと「成りますか？」の確認が出るので、
        「成る」か「成らず」を選べます。行き場のない駒になる場合などは自動的に成ります。
      </>
    ),
  },
  {
    title: '投了・引き分けの提案',
    body: (
      <>
        「投了 / 終了を提案」ボタンを押すと、相手に終局の提案が届きます。
        相手が「同意する」を選ぶとそこで対局終了（提案した側の負け）、
        「拒否する」を選ぶと対局が続きます。
      </>
    ),
  },
  {
    title: '再戦',
    body: (
      <>
        詰みや投了で対局が終わると結果画面が出ます。
        「もう一度対局する」を押せば、同じ部屋・同じ先手後手のまま盤面だけリセットして再戦できます。
      </>
    ),
  },
];

export default function TutorialGuide() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    try {
      const seen = window.localStorage.getItem(STORAGE_KEY);
      if (!seen) {
        setIsOpen(true);
        window.localStorage.setItem(STORAGE_KEY, '1');
      }
    } catch {
      // localStorageが使えない環境（プライベートモード等）では自動表示をスキップ
    }
  }, []);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        aria-label="遊び方を見る"
        title="遊び方を見る"
        className="btn-pill fixed top-3 right-3 sm:top-4 sm:right-4 z-[90] w-9 h-9 sm:w-10 sm:h-10 text-sm font-bold"
      >
        ?
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/40 backdrop-blur-[2px]">
          <div className="meishi-card meishi-fade-in w-full max-w-md max-h-[85vh] overflow-y-auto shadow-[0_25px_50px_-12px_rgba(43,36,32,0.3)]">
            <div className="h-1.5 bg-[var(--maroon)] w-full" />

            <div className="p-6 sm:p-8">
              <div className="flex flex-col items-center mb-6 sm:mb-8">
                <h2 className="[font-family:var(--font-heading)] text-xl sm:text-2xl font-bold text-[var(--maroon)] tracking-[0.15em] mb-2">
                  遊び方ガイド
                </h2>
                <div className="w-10 h-px bg-[var(--gold-soft)] opacity-70" />
              </div>

              <ol className="space-y-5 mb-8">
                {STEPS.map((step, i) => (
                  <li key={i} className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[var(--maroon)] text-[#fff5e8] text-[11px] font-bold flex items-center justify-center mt-0.5">
                      {i + 1}
                    </span>
                    <div>
                      <p className="text-sm font-bold text-[var(--ink)] mb-1 tracking-wide">
                        {step.title}
                      </p>
                      <p className="text-xs text-[var(--ink-soft)] leading-relaxed tracking-wide">
                        {step.body}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>

              <button
                onClick={() => setIsOpen(false)}
                className="btn-pill-primary w-full py-3.5 text-sm font-bold tracking-[0.2em] active:scale-[0.98]"
              >
                はじめる
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
