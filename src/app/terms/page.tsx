'use client';

import Link from 'next/link';

export default function TermsPage() {
  return (
    <main className="min-h-screen py-10 px-4 sm:px-6 bg-[#faf8f5] text-stone-800 font-sans">
      <div className="max-w-3xl mx-auto bg-white p-8 sm:p-12 shadow-sm border border-stone-200 rounded-sm">
        <h1 className="text-2xl font-bold tracking-[0.2em] mb-8 pb-4 border-b border-stone-100 text-[#7a0000] font-serif">利用規約</h1>
        
        <div className="space-y-8 text-sm leading-relaxed text-stone-600">
          <section>
            <h2 className="text-stone-800 font-bold mb-3 tracking-widest text-xs uppercase">1. 本規約の適用</h2>
            <p>本規約は、本アプリケーション「わけあって、将棋。」（以下「本サービス」）を利用するすべてのユーザーに適用されます。</p>
          </section>

          <section>
            <h2 className="text-stone-800 font-bold mb-3 tracking-widest text-xs uppercase">2. 禁止事項</h2>
            <p>ユーザーは、本サービスの利用にあたり、以下の行為を行ってはなりません：</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>公序良俗に反する行為</li>
              <li>本サービスの運営を妨害する行為</li>
              <li>他のユーザーに対する誹謗中傷、迷惑行為</li>
              <li>ソフト指し（研究用ソフトウェアを用いた不正な対局）</li>
            </ul>
          </section>

          <section>
            <h2 className="text-stone-800 font-bold mb-3 tracking-widest text-xs uppercase">3. 免責事項</h2>
            <p>本サービスは「現状のまま」提供され、動作の正確性や継続性を保証するものではありません。本サービスの利用により生じた損害について、運営者は一切の責任を負いません。</p>
          </section>

          <section>
            <h2 className="text-stone-800 font-bold mb-3 tracking-widest text-xs uppercase">4. 著作権について</h2>
            <p>本サービスで提供される音声素材、画像、コード等の著作権は、それぞれの権利者に帰属します。</p>
          </section>
        </div>

        <div className="mt-12 pt-8 border-t border-stone-100 flex justify-center">
          <Link 
            href="/"
            className="px-8 py-3 bg-stone-100 hover:bg-stone-200 text-stone-600 text-xs tracking-[0.2em] transition duration-300"
          >
            タイトルに戻る
          </Link>
        </div>
      </div>
    </main>
  );
}
