import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { fontVariables } from "@/shared/fonts";
import { Providers } from "@/shared/providers";
import "./globals.css";

export const metadata: Metadata = {
  title: "Insurance Platform",
  description: "보험 플랫폼 웹"
};

export const viewport: Viewport = {
  viewportFit: "cover"
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ko" className={fontVariables}>
      <body className="min-h-dvh bg-paper font-sans text-ink antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
