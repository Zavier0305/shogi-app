'use client';

import Link from 'next/link';

export default function TermsPage() {
  return (
    <main className="min-h-screen py-16 px-6 sm:px-12 text-[var(--ink)]">
      <div className="meishi-card meishi-fade-in max-w-2xl mx-auto p-8 sm:p-16 shadow-sm">
        <h1 className="text-xl sm:text-2xl font-bold tracking-[0.3em] text-[var(--maroon)] mb-12 text-center">
          利用規約
        </h1>

        <div className="space-y-10 text-sm leading-relaxed tracking-wider">
          <section>
            <h2 className="font-bold border-l-2 border-[var(--maroon)] pl-4 mb-4 text-[var(--ink)]">1. 本規約の適用</h2>
            <p className="text-[var(--ink-soft)]">
              本規約は、本アプリケーション「わけあって、将棋。」（以下「本サービス」）を利用するすべてのユーザーに適用されます。
            </p>
          </section>

          <section>
            <h2 className="font-bold border-l-2 border-[var(--maroon)] pl-4 mb-4 text-[var(--ink)]">2. 禁止事項</h2>
            <p className="text-[var(--ink-soft)]">ユーザーは、本サービスの利用にあたり、以下の行為を行ってはなりません：</p>
            <ul className="list-disc list-inside mt-2 space-y-2 text-[var(--ink-soft)]">
              <li>公序良俗に反する行為</li>
              <li>本サービスの運営を妨害する行為</li>
              <li>他のユーザーに対する誹謗中傷、迷惑行為</li>
              <li>ソフト指し（研究用ソフトウェアを用いた不正な対局）</li>
            </ul>
          </section>

          <section>
            <h2 className="font-bold border-l-2 border-[var(--maroon)] pl-4 mb-4 text-[var(--ink)]">3. 免責事項</h2>
            <p className="text-[var(--ink-soft)]">
              本サービスは「現状のまま」提供され、動作の正確性や継続性を保証するものではありません。本サービスの利用により生じた損害について、運営者は一切の責任を負いません。
            </p>
          </section>

          <section>
            <h2 className="font-bold border-l-2 border-[var(--maroon)] pl-4 mb-4 text-[var(--ink)]">4. 著作権について</h2>
            <p className="text-[var(--ink-soft)]">
              本サービスで提供される音声素材、画像、コード等の著作権は、それぞれの権利者に帰属します。
            </p>
          </section>

          <div className="pt-12 border-t border-[var(--border)] mt-12 text-center text-[10px] text-[var(--ink-faint)]">
            <Link href="/" className="hover:text-[var(--maroon)] transition tracking-[0.2em] decoration-[var(--border)]">HOMEに戻る</Link>
          </div>
        </div>
      </div>
    </main>
  );
}
