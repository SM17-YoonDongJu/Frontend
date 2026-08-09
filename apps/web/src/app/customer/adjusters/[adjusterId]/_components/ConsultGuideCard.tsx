"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/shared/ui/Button";
import type { ConsultGuide } from "../_model/types";

interface ConsultGuideCardProps {
  adjusterId: string;
  consultGuide: ConsultGuide;
}

export function ConsultGuideCard({ adjusterId, consultGuide }: ConsultGuideCardProps) {
  const router = useRouter();

  const rows = [
    { label: "상담 방식", value: consultGuide.method },
    { label: "초기 상담", value: consultGuide.initialConsult },
    { label: "수임 방식", value: consultGuide.feeBasis },
  ];

  const startConsult = () => {
    router.push(`/customer/chat?adjusterId=${adjusterId}`);
  };

  return (
    <section className="rounded-card-lg border border-line bg-card p-6">
      <h2 className="text-base font-semibold text-ink">상담 안내</h2>

      <dl className="mt-4 divide-y divide-line">
        {rows.map((row) => (
          <div key={row.label} className="flex items-center justify-between py-3 first:pt-0">
            <dt className="text-sm text-ink-3">{row.label}</dt>
            <dd className="text-sm font-semibold text-ink">{row.value}</dd>
          </div>
        ))}
      </dl>

      <Button
        full
        className="mt-5 hidden lg:inline-flex"
        onClick={startConsult}
        icon={
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        }
      >
        상담 신청
      </Button>
      <p className="mt-3 hidden text-center text-xs text-ink-3 lg:block">분석 리포트를 첨부해 요청합니다</p>
    </section>
  );
}
