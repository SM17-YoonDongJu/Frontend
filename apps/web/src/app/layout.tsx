import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { fontVariables } from "@/shared/fonts";
import { getIsAppWebView } from "@/shared/lib/app-webview";
import { DeviceTokenRegistrar } from "@/shared/lib/DeviceTokenRegistrar";
import { Providers } from "@/shared/providers";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Insurance Platform",
    template: "%s | 바른보상"
  },
  description: "보험 플랫폼 웹"
};

export const viewport: Viewport = {
  viewportFit: "cover"
};

export default async function RootLayout({ children }: { children: ReactNode }) {
  const isApp = await getIsAppWebView();

  return (
    <html lang="ko" className={fontVariables}>
      <body className="min-h-dvh bg-paper font-sans text-ink antialiased">
        <Providers>
          {isApp && <DeviceTokenRegistrar />}
          {children}
        </Providers>
      </body>
    </html>
  );
}
