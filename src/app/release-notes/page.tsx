import fs from 'fs';
import path from 'path';
import Link from 'next/link';

export default async function ReleaseNotesPage() {
  const filePath = path.join(process.cwd(), 'RELEASE_NOTES.md');
  const content = fs.readFileSync(filePath, 'utf8');

  return (
    <main className="min-h-screen py-10 px-4 sm:px-6 bg-[#faf8f5] text-stone-800 font-sans">
      <div className="max-w-3xl mx-auto bg-white p-8 sm:p-12 shadow-sm border border-stone-200 rounded-sm">
        <h1 className="text-2xl font-bold tracking-[0.2em] mb-8 pb-4 border-b border-stone-100 text-[#7a0000] font-serif">リリースノート</h1>
        
        <div className="whitespace-pre-wrap text-sm leading-relaxed text-stone-600 font-sans prose prose-stone max-w-none">
          {content}
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
