/**
 * Next.js 루트 레이아웃
 * - 다크모드 기본 설정
 * - 메타데이터 (SEO)
 * - 전역 폰트
 */
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "PromptHub — 프롬프트 공유 플랫폼",
  description: "AI 프롬프트를 공유하고 발견하세요. ChatGPT, Claude, Midjourney 등 다양한 AI 플랫폼의 최고 프롬프트를 한 곳에서.",
  keywords: ["프롬프트", "AI", "ChatGPT", "Midjourney", "Claude", "DALL-E", "프롬프트 공유"],
  authors: [{ name: "PromptHub" }],
  openGraph: {
    title: "PromptHub",
    description: "AI 프롬프트 공유 플랫폼",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" className={inter.variable}>
      <body className="min-h-screen bg-[#111111] font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
