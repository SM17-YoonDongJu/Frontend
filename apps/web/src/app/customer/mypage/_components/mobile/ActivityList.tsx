"use client";

import { useActivitySummary } from "../../_api/use-activity-summary";
import { FileText } from "@/shared/ui/icons/FileText";
import { MessageCircle } from "@/shared/ui/icons/MessageCircle";
import { MessageSquare } from "@/shared/ui/icons/MessageSquare";
import { MobileMenuRow } from "./MobileMenuRow";
import { MobileSection } from "./MobileSection";

const ICON_CLASS = "size-[1.125rem]";

/** 모바일 보상 활동 리스트 — 내 분석 리포트 / 받은 제안(NEW) / 상담 내역. */
export function ActivityList() {
  const { data: counts } = useActivitySummary();

  return (
    <MobileSection title="보상 활동">
      <MobileMenuRow
        href="/customer/dashboard"
        icon={<FileText className={ICON_CLASS} />}
        label="내 분석 리포트"
        right={<CountText value={`${counts.reportCount}건`} />}
      />
      <MobileMenuRow
        href="/customer/dashboard"
        icon={<MessageSquare className={ICON_CLASS} />}
        label="받은 제안"
        right={
          counts.proposalCount > 0 ? (
            <span className="inline-flex items-center rounded-pill bg-gold-soft px-2 py-0.5 text-[0.6875rem] font-bold text-gold-ink">
              NEW {counts.proposalCount}
            </span>
          ) : undefined
        }
      />
      <MobileMenuRow
        href="/customer/chat"
        icon={<MessageCircle className={ICON_CLASS} />}
        label="상담 내역"
        right={
          counts.consultCount > 0 ? (
            <CountText value={`${counts.consultCount}건 진행 중`} />
          ) : undefined
        }
      />
    </MobileSection>
  );
}

function CountText({ value }: { value: string }) {
  return <span className="text-[0.8125rem] font-bold text-ink-3">{value}</span>;
}
