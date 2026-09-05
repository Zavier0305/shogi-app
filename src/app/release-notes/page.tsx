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
    <main className="min-h-screen py-16 px-6 sm:px-12 text-[var(--ink)]">
      <div className="meishi-card meishi-fade-in max-w-2xl mx-auto p-8 sm:p-16 shadow-sm">
        <h1 className="text-xl sm:text-2xl font-bold tracking-[0.3em] text-[var(--maroon)] mb-12 text-center">
          リリースノート
        </h1>

        <div className="prose prose-stone max-w-none">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              h1: ({ children }) => <h2 className="text-lg font-bold text-[var(--ink)] border-b border-[var(--border)] pb-2 mb-6 mt-12 first:mt-0 tracking-widest">{children}</h2>,
              h2: ({ children }) => (
                <div className="flex items-center gap-3 mt-12 mb-6 group">
                  <div className="h-6 w-1 bg-[var(--maroon)] rounded-full"></div>
                  <h2 className="text-base font-bold text-[var(--ink)] tracking-wider m-0">{children}</h2>
                </div>
              ),
              h3: ({ children }) => <h3 className="text-sm font-bold text-[var(--ink)] mt-8 mb-4 tracking-wide">{children}</h3>,
              h4: ({ children }) => <h4 className="text-[11px] font-bold text-[var(--ink-faint)] uppercase tracking-[0.2em] mt-6 mb-2">{children}</h4>,
              p: ({ children }) => <p className="text-sm leading-relaxed text-[var(--ink-soft)] mb-4 tracking-wide">{children}</p>,
              ul: ({ children }) => <ul className="list-none space-y-3 my-6 pl-0">{children}</ul>,
              li: ({ children }) => (
                <li className="flex gap-3 text-sm text-[var(--ink-soft)] items-start">
                  <span className="text-[var(--maroon)] mt-1.5 min-w-[4px] h-[4px] bg-[var(--maroon)] rounded-full"></span>
                  <span className="flex-1">{children}</span>
                </li>
              ),
              hr: () => <hr className="my-12 border-none h-px bg-gradient-to-r from-transparent via-[var(--gold-soft)] to-transparent" />,
              blockquote: ({ children }) => (
                <blockquote className="border-l-2 border-[var(--border)] pl-6 my-8 italic text-[var(--ink-faint)] text-sm italic">
                  {children}
                </blockquote>
              ),
              a: ({ children, href }) => (
                <a href={href} className="text-[var(--maroon)] hover:underline decoration-1 underline-offset-4 transition-colors">
                  {children}
                </a>
              ),
              strong: ({ children }) => <strong className="font-bold text-[var(--ink)]">{children}</strong>,
            }}
          >
            {content}
          </ReactMarkdown>

          <div className="pt-16 border-t border-[var(--border)] mt-16 text-center">
            <Link href="/" className="text-[10px] tracking-[0.3em] text-[var(--ink-faint)] hover:text-[var(--maroon)] transition-colors uppercase decoration-[var(--border)]">
              タイトルに戻る
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
