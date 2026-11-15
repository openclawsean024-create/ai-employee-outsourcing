import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import { BRAND } from "@/content/brand";
import "./globals.css";

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-manrope",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: `${BRAND.name}｜${BRAND.tagline}`,
    template: `%s｜${BRAND.name}`,
  },
  description: BRAND.description,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-TW" className={manrope.variable}>
      <body>{children}</body>
    </html>
  );
}
