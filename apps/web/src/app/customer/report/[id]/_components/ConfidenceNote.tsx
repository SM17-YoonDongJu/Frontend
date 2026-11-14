"use client";

import { useId } from "react";
import { cn } from "@/shared/lib/utils";

export interface ConfidenceNoteProps {
  /** 등급 문구. null이면 사유 목록만 보인다. */
  note: string | null;
  /** 서버 confidence.reasons — 문자열·순서 그대로 보인다(가공 금지). */
  reasons: readonly string[];
  className?: string;
}

/** 예상 보상 범위 카드(navy) 안의 신뢰도 문구 박스. 표시 여부 판단은 소비처(resolveConfidenceNote)가 한다. */
export function ConfidenceNote({ note, reasons, className }: ConfidenceNoteProps) {
  const titleId = useId();
  const hasReasons = reasons.length > 0;

  return (
    // break-keep: 좁은 데스크톱 박스(15rem)에서 문구·사유가 낱자 단위로 끊기지 않게(예: "변동 폭/이", "어림 범/위").
    <div
      className={cn(
        "break-keep rounded-card bg-white/10 px-4 py-3 text-[0.78rem] leading-relaxed text-white/80",
        className,
      )}
    >
      {note && <p>{note}</p>}
      {hasReasons && (
        <div className={cn(note && "mt-2 border-t border-white/15 pt-2")}>
          <p id={titleId} className="text-[0.6875rem] font-semibold text-white/55">
            신뢰도 사유
          </p>
          <ul
            aria-labelledby={titleId}
            className="mt-1 list-disc space-y-0.5 pl-4 marker:text-white/40"
          >
            {/* 사유는 조건마다 한 번만 붙는 고정 문구라 문자열 자체가 고유 키다. */}
            {reasons.map((reason) => (
              <li key={reason}>{reason}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
