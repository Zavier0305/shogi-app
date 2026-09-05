import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

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
    <html
      lang="ja"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
