import type { StatusBadgeProps } from "@/shared/ui/StatusBadge";
import type { PendingReviewStatus } from "./types";

type Tone = NonNullable<StatusBadgeProps["tone"]>;

export const PENDING_STATUS_META: Record<PendingReviewStatus, { label: string; tone: Tone }> = {
  AWAITING_INSPECTION: { label: "검수 대기", tone: "gold" },
  AWAITING_ADOPTION: { label: "채택 대기", tone: "navy" },
  COUNSELING: { label: "상담 중", tone: "green" },
  MATCHED: { label: "매칭 완료", tone: "neutral" },
};

/** 필터 탭 — 전체 + 상태별. */
export const PENDING_FILTER_TABS: { value: string; label: string }[] = [
  { value: "", label: "전체" },
  { value: "AWAITING_INSPECTION", label: "검수 대기" },
  { value: "AWAITING_ADOPTION", label: "채택 대기" },
  { value: "COUNSELING", label: "상담 중" },
];
