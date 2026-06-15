import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Gowun_Batang } from "next/font/google";
import { MockProvider } from "@/shared/mocks/mock-provider";
import QueryProvider from "@/shared/providers/query-provider";
import "./globals.css";

// Title 계열 전용 세리프. CJK라 전체 preload 안 함(용량) → preload: false.
const gowunBatang = Gowun_Batang({
  weight: ["400", "700"],
  variable: "--font-gowun-batang",
  display: "swap",
  preload: false
});

export const metadata: Metadata = {
  title: "Insurance Platform",
  description: "보험 플랫폼 웹"
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ko" className={gowunBatang.variable}>
      <body className="min-h-dvh bg-white text-gray-900 antialiased dark:bg-gray-950 dark:text-gray-100">
        <MockProvider>
          <QueryProvider>{children}</QueryProvider>
        </MockProvider>
      </body>
    </html>
  );
}
