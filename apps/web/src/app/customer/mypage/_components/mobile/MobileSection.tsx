import type { ReactNode } from "react";

interface MobileSectionProps {
  title: string;
  /** 헤더 우측 액션(예: 전체 보기 링크) */
  action?: ReactNode;
  children: ReactNode;
}

/** 모바일 섹션 셸 — 오버라인 타이틀 + 흰 카드(행 구분선). */
export function MobileSection({ title, action, children }: MobileSectionProps) {
  return (
    <section>
      <div className="mb-2 flex items-center justify-between px-1">
        <h2 className="text-[0.8125rem] font-bold text-ink-2">{title}</h2>
        {action}
      </div>
      <div className="divide-y divide-line-2 rounded-card border border-line bg-card px-4">
        {children}
      </div>
    </section>
  );
}
