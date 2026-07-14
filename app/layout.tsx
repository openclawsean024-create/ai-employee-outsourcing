import type { Metadata } from "next";
import { Inter, Sora } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
});

const sora = Sora({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-sora",
  display: "swap",
});

export const metadata: Metadata = {
  title: "AI Employee — 144 種 AI Agent 隨選即用",
  description: "把重複工作交給 AI。144 種預載 Agent + 多 Agent 協作 + Freemium。",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-TW" className={`${inter.variable} ${sora.variable}`}>
      <body>{children}</body>
    </html>
  );
}