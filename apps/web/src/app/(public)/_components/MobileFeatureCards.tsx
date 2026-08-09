import type { ReactNode } from "react";
import { FileText } from "@/shared/ui/icons/FileText";
import { MessageBubble } from "@/shared/ui/icons/MessageBubble";
import { ShieldCheck } from "@/shared/ui/icons/ShieldCheck";

interface Feature {
  icon: ReactNode;
  title: string;
  body: string;
}

const FEATURES: Feature[] = [
  {
    icon: <FileText className="size-5" />,
    title: "AI 보상 분석",
    body: "진단서·증권을 올리면 예상 보상 범위를 산출"
  },
  {
    icon: <ShieldCheck className="size-5" />,
    title: "손해사정사 검수",
    body: "모든 리포트는 자격 보유 사정사가 직접 검수"
  },
  {
    icon: <MessageBubble className="size-5" />,
    title: "1:1 상담 연결",
    body: "리포트 기반으로 전문가와 바로 상담"
  }
];

/**
 * 모바일 기능 카드 3종(md 미만).
 */
export function MobileFeatureCards() {
  return (
    <section className="mt-[3.3125rem] flex flex-col gap-[0.6875rem] px-6">
      {FEATURES.map((feature) => (
        <div
          key={feature.title}
          className="flex h-[4.75rem] items-center gap-3.5 rounded-[0.9375rem] border border-line-2 bg-card px-[1.125rem]"
        >
          <span className="flex size-[2.625rem] shrink-0 items-center justify-center rounded-[0.75rem] bg-gold-soft text-gold-ink">
            {feature.icon}
          </span>
          <span className="flex flex-col gap-0.5">
            <span className="text-[0.875rem] font-bold text-ink">{feature.title}</span>
            <span className="text-[0.75rem] text-ink-3">{feature.body}</span>
          </span>
        </div>
      ))}
    </section>
  );
}
