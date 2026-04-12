import React from 'react';

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-[#faf8f5] py-16 px-6 sm:px-12 text-stone-700 font-sans">
      <div className="max-w-2xl mx-auto bg-white p-8 sm:p-16 shadow-sm border border-stone-100 rounded-sm">
        <h1 className="text-xl sm:text-2xl font-bold tracking-[0.3em] text-[#7a0000] mb-12 text-center">
          プライバシーポリシー
        </h1>

        <div className="space-y-10 text-sm leading-relaxed tracking-wider">
          <section>
            <h2 className="font-bold border-l-2 border-[#7a0000] pl-4 mb-4">データの取り扱いについて</h2>
            <p className="text-stone-500">
              「わけあって、将棋。」（以下、本サービス）では、ユーザーの利便性向上および対局機能の提供を目的として、最小限のデータを取得しています。
            </p>
          </section>

          <section>
            <h2 className="font-bold border-l-2 border-[#7a0000] pl-4 mb-4">取得する情報</h2>
            <ul className="list-disc list-inside space-y-2 text-stone-500">
              <li>対局の指し手データ（棋譜）</li>
              <li>ブラウザのセッション識別子（対局状態の維持に利用）</li>
              <li>接続元のIPアドレス（スパム・不正アクセス防止に利用）</li>
            </ul>
          </section>

          <section>
            <h2 className="font-bold border-l-2 border-[#7a0000] pl-4 mb-4">情報の利用目的</h2>
            <p className="text-stone-500">
              取得した情報は、オンライン対局のリアルタイム同期、およびサービスの正常な運営のためにのみ使用されます。
            </p>
          </section>

          <section>
            <h2 className="font-bold border-l-2 border-[#7a0000] pl-4 mb-4">サードパーティ・サービス</h2>
            <p className="text-stone-500">
              本サービスでは、以下の外部サービスを利用しています：
            </p>
            <ul className="list-disc list-inside mt-4 space-y-2 text-stone-500">
              <li>Pusher（リアルタイム通信）</li>
              <li>Supabase（データ管理）</li>
              <li>Vercel（ホスティング）</li>
            </ul>
          </section>

          <div className="pt-12 border-t border-stone-100 mt-12 text-center text-[10px] text-stone-400">
            <a href="/" className="hover:text-stone-600 transition tracking-[0.2em] decoration-stone-200">HOMEに戻る</a>
          </div>
        </div>
      </div>
    </main>
  );
}
