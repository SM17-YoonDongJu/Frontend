import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Gowun_Batang, Inter } from "next/font/google";
import { Providers } from "@/shared/providers";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap"
});

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
    <html lang="ko" className={`${inter.variable} ${gowunBatang.variable}`}>
      <body className="min-h-dvh bg-paper font-sans text-ink antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
