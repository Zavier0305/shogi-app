import fs from 'fs';
import path from 'path';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default async function ReleaseNotesPage() {
  const filePath = path.join(process.cwd(), 'RELEASE_NOTES.md');
  let content = '';
  try {
    content = fs.readFileSync(filePath, 'utf8');
  } catch (e) {
    content = '# Release Notes\n\nComing soon...';
  }

  return (
    <main className="min-h-screen bg-[#faf8f5] py-16 px-6 sm:px-12 text-stone-700 font-sans">
      <div className="max-w-2xl mx-auto bg-white p-8 sm:p-16 shadow-sm border border-stone-100 rounded-sm">
        <h1 className="text-xl sm:text-2xl font-bold tracking-[0.3em] text-[#7a0000] mb-12 text-center">
          リリースノート
        </h1>

        <div className="prose prose-stone max-w-none">
          <ReactMarkdown 
            remarkPlugins={[remarkGfm]}
            components={{
              h1: ({ children }) => <h2 className="text-lg font-bold text-stone-800 border-b border-stone-100 pb-2 mb-6 mt-12 first:mt-0 tracking-widest">{children}</h2>,
              h2: ({ children }) => (
                <div className="flex items-center gap-3 mt-12 mb-6 group">
                  <div className="h-6 w-1 bg-[#7a0000] rounded-full"></div>
                  <h2 className="text-base font-bold text-stone-800 tracking-wider m-0">{children}</h2>
                </div>
              ),
              h3: ({ children }) => <h3 className="text-sm font-bold text-stone-700 mt-8 mb-4 tracking-wide">{children}</h3>,
              h4: ({ children }) => <h4 className="text-[11px] font-bold text-stone-400 uppercase tracking-[0.2em] mt-6 mb-2">{children}</h4>,
              p: ({ children }) => <p className="text-sm leading-relaxed text-stone-500 mb-4 tracking-wide">{children}</p>,
              ul: ({ children }) => <ul className="list-none space-y-3 my-6 pl-0">{children}</ul>,
              li: ({ children }) => (
                <li className="flex gap-3 text-sm text-stone-500 items-start">
                  <span className="text-[#7a0000] mt-1.5 min-w-[4px] h-[4px] bg-[#7a0000] rounded-full"></span>
                  <span className="flex-1">{children}</span>
                </li>
              ),
              hr: () => <hr className="my-12 border-none h-px bg-gradient-to-r from-transparent via-stone-200 to-transparent" />,
              blockquote: ({ children }) => (
                <blockquote className="border-l-2 border-stone-100 pl-6 my-8 italic text-stone-400 text-sm italic">
                  {children}
                </blockquote>
              ),
              a: ({ children, href }) => (
                <a href={href} className="text-[#a32222] hover:underline decoration-1 underline-offset-4 transition-colors">
                  {children}
                </a>
              ),
              strong: ({ children }) => <strong className="font-bold text-stone-700">{children}</strong>,
            }}
          >
            {content}
          </ReactMarkdown>

          <div className="pt-16 border-t border-stone-50 mt-16 text-center">
            <Link href="/" className="text-[10px] tracking-[0.3em] text-stone-300 hover:text-stone-500 transition-colors uppercase decoration-stone-200">
              タイトルに戻る
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
