import type { Metadata } from "next";
import "./globals.css";

const title = "わけあって、将棋。| オンライン対局";
const description = "シンプルで、心地よいオンライン対局。わけあって、将棋。";

export const metadata: Metadata = {
  title,
  description,
  // 対局URLを友達に共有して誘う使い方が前提のアプリなのに、
  // OGP/Twitter Cardが一切なくシェア時の見た目が素っ気なかったため追加
  openGraph: {
    type: "website",
    title,
    description,
  },
  twitter: {
    card: "summary",
    title,
    description,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" className="h-full antialiased">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Shippori+Mincho:wght@500;700;800&family=Noto+Sans+JP:wght@400;500;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
