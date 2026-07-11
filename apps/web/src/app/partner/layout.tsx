import type { ReactNode } from "react";
import { getIsAppWebView } from "@/shared/lib/app-webview";
import { AppTabBar } from "@/shared/ui/AppTabBar";
import { Footer } from "@/shared/ui/Footer";
import { PartnerHeader } from "./_components/PartnerHeader";

/** 파트너(손해사정사) 페이지 레이아웃 셸 — 파트너 헤더 + 본문 + 푸터. 앱에서는 헤더·푸터 대신 하단 탭바. */
export default async function PartnerLayout({ children }: { children: ReactNode }) {
  const isApp = await getIsAppWebView();

  return (
    <div className="flex min-h-dvh flex-col">
      {!isApp && <PartnerHeader />}
      <main className="flex-1">{children}</main>
      {!isApp && <Footer />}
      {isApp && <AppTabBar variant="partner" />}
    </div>
  );
}
