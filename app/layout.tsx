import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI 員工外包平台 | 144 種 AI Agent 多 Agent 協作",
  description: "144 種預載 AI Agent + 多 Agent 協作 + Freemium — 從客服到行銷、從設計到法務，1 個月費搞定所有工作",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-TW">
      <body>{children}</body>
    </html>
  );
}