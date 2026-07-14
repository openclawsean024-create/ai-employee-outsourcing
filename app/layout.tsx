import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-jakarta",
  display: "swap",
});

export const metadata: Metadata = {
  title: "AI Employee — 把 144 種工作變成 AI Agent",
  description: "AI 員工外包平台：144 種預載 Agent + 多 Agent 協作 + Freemium",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-TW" className={jakarta.variable}>
      <body>{children}</body>
    </html>
  );
}