import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { fontVariables } from "@/shared/fonts";
import { getIsAppWebView } from "@/shared/lib/app-webview";
import { DeviceTokenRegistrar } from "@/shared/lib/DeviceTokenRegistrar";
import { Providers } from "@/shared/providers";
import "./globals.css";

const SITE_NAME = "바른보상";
const SITE_URL = "https://www.brbosang.com";
const SITE_TITLE = "바른보상 | 손해사정 매칭 플랫폼";
const SITE_DESCRIPTION =
  "받은 보험금이 적정한지 약관·특약·판례로 분석하고, 필요할 때 손해사정사와 연결해 드립니다.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_TITLE,
    template: `%s | ${SITE_NAME}`
  },
  description: SITE_DESCRIPTION,
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    locale: "ko_KR"
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION
  }
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
