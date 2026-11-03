import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { fontVariables } from "@/shared/fonts";
import { getIsAppWebView } from "@/shared/lib/app-webview";
import { DeviceTokenRegistrar } from "@/shared/lib/DeviceTokenRegistrar";
import { Providers } from "@/shared/providers";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "바른보상 | 손해사정 매칭 플랫폼",
    template: "%s | 바른보상"
  },
  description:
    "받은 보험금이 적정한지 약관·특약·판례로 분석하고, 필요할 때 손해사정사와 연결해 드립니다."
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
