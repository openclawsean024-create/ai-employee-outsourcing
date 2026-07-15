import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-manrope",
  display: "swap",
});

export const metadata: Metadata = {
  title: "AI Employee — 144 種 AI Agent 隨選即用",
  description: "把重複工作交給 AI。144 種預載 Agent + 多 Agent 協作 + Freemium。",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-TW" className={manrope.variable}>
      <body>{children}</body>
    </html>
  );
}