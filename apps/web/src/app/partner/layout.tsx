import type { ReactNode } from "react";
import { PartnerHeader } from "./_components/PartnerHeader";
import { Footer } from "@/shared/ui/Footer";

/** 파트너(손해사정사) 페이지 레이아웃 셸 — 파트너 헤더 + 본문 + 푸터. */
export default function PartnerLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col">
      <PartnerHeader />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
